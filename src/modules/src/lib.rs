use ab_glyph::{Font, FontRef, PxScale, ScaleFont};
use anyhow::{Context, Result};
use image::{
    DynamicImage, GenericImage, ImageEncoder, Pixel, Rgba, RgbaImage,
    codecs::png,
    imageops::{self, FilterType},
};
use imageproc::{
    drawing::{Canvas, draw_text_mut},
    rect::Rect,
};
use serde::Deserialize;
use std::{
    ffi::{CStr, c_char, c_void},
    ptr,
};

#[derive(Deserialize, Debug)]
struct RecentItem {
    status: String,
    #[serde(alias = "imageUrl")]
    image_url: String,
}

async fn fetch_cover(image_url: &str) -> Result<DynamicImage> {
    let cover_data = reqwest::get(image_url)
        .await
        .context("Failed to fetch image")?
        .bytes()
        .await
        .context("Failed to read image bytes")?;
    Ok(image::load_from_memory(&cover_data)?)
}

fn internal_generate_recent_image(json_data: String) -> Result<*mut c_char> {
    let data: Vec<RecentItem> = serde_json::from_str(&json_data)?;
    let mut recent_image = RgbaImage::new(900, 900);

    let mut x = 0;
    let mut y = 0;
    let size = 300;

    let font = FontRef::try_from_slice(include_bytes!("../assets/OpenSans-Regular.ttf"))?;

    let rt = tokio::runtime::Runtime::new()?;

    let cover_images = rt.block_on(async {
        let futures: Vec<_> = data
            .iter()
            .map(|item| {
                let image_url = item.image_url.clone();
                tokio::spawn(async move { fetch_cover(&image_url).await })
            })
            .collect();

        let mut results = Vec::new();
        for future in futures {
            match future.await {
                Ok(Ok(image_data)) => results.push(image_data),
                Ok(Err(e)) => {
                    eprintln!("Error fetching image data: {}", e);
                }
                Err(e) => {
                    eprintln!("Error in async task: {}", e);
                }
            }
        }
        results
    });

    for (i, cover) in cover_images.into_iter().enumerate() {
        let (orig_width, orig_height) = cover.dimensions();
        let new_height = (orig_height as f32 * size as f32 / orig_width as f32) as u32;
        let mut scaled_cover = cover
            .resize(size, new_height, FilterType::CatmullRom)
            .into_rgba8();

        let mut cropped_cover = imageops::crop(&mut scaled_cover, 0, 0, size, size).to_image();

        draw_text_on_image(&mut cropped_cover, &data[i].status, &font, 16.0);

        recent_image.copy_from(&cropped_cover, x, y)?;

        x += size;
        if x >= 900 {
            x = 0;
            y += size;
        }
    }

    let mut buf = Vec::new();
    let encoder = png::PngEncoder::new(&mut buf);
    encoder.write_image(&recent_image, 900, 900, image::ColorType::Rgba8.into())?;

    let size = buf.len() as u32;
    let mut final_buf = Vec::with_capacity(4 + buf.len());
    final_buf.extend_from_slice(&size.to_be_bytes());
    final_buf.append(&mut buf);

    let boxed = final_buf.into_boxed_slice();
    let ptr = boxed.as_ptr() as *mut c_char;

    std::mem::forget(boxed);

    Ok(ptr)
}

#[unsafe(no_mangle)]
/// # Safety
/// Make sure `json_ptr` does point to a valid Cstr
/// It generates a 3x3 grid image of the user's recent media.
pub unsafe extern "C" fn GenerateRecentImage(json_ptr: *const c_char) -> *mut c_char {
    let _json_data = unsafe { CStr::from_ptr(json_ptr) };

    let json_data = String::from_utf8_lossy(_json_data.to_bytes()).to_string();

    let res = internal_generate_recent_image(json_data);
    match res {
        Ok(ptr) => ptr,
        Err(err) => {
            eprintln!("{}", err);
            ptr::null_mut()
        }
    }
}

#[unsafe(no_mangle)]
/// # Safety
/// Used to later cleanup memory
pub unsafe extern "C" fn Free(ptr: *mut c_void) {
    if ptr.is_null() {
        return;
    }

    let boxed_ptr = ptr as *mut i32;

    unsafe {
        drop(Box::from_raw(boxed_ptr));
    }
}

fn draw_text_on_image(image: &mut RgbaImage, text: &str, font: &FontRef, size: f32) {
    let font_color = Rgba([255, 255, 255, 255]);
    let background_color = Rgba([0, 0, 0, 192]);

    let scale = PxScale { x: size, y: size };
    let lines: Vec<&str> = text.split('\n').collect(); // Split the text into lines

    let max_size = 300; // Maximum width for the text (image width)
    let line_height = size * 1.1; // Height for each line, including some spacing

    let total_text_height = lines.len() as f32 * line_height;

    let mut y_pos = 300.0 - total_text_height - 10.0; // Adjust 10px padding from the bottom

    let padding = 5;

    for line in lines {
        let (text_width, text_height) = get_text_bounds(font, scale, line);

        let x_pos = (max_size - text_width) / 2;
        let rect_x = (x_pos - padding).max(0);
        let rect_y: i32 = (y_pos as i32 - padding).max(0);
        let rect_width = (text_width + 2 * padding).min(max_size);
        let rect_height = (text_height + 2 * padding).min(max_size);

        let rect = imageproc::rect::Rect::at(rect_x, rect_y)
            .of_size(rect_width as u32, rect_height as u32);
        blend_rectangle(image, rect, background_color);

        draw_text_mut(image, font_color, x_pos, y_pos as i32, scale, font, line);

        y_pos += line_height + padding as f32 + 1.0;
    }
}

fn get_text_bounds(font: &FontRef, scale: PxScale, text: &str) -> (i32, i32) {
    let scaled_font = font.as_scaled(scale);

    let mut width = 0.0f32;

    for ch in text.chars() {
        let glyph_id = scaled_font.glyph_id(ch);
        width += scaled_font.h_advance(glyph_id);
    }

    let height = scale.y;

    (width.ceil() as i32, height.ceil() as i32)
}

fn blend_rectangle(image: &mut RgbaImage, rect: Rect, color: Rgba<u8>) {
    for y in rect.top()..rect.bottom() {
        for x in rect.left()..rect.right() {
            let pixel = image.get_pixel_mut(x as u32, y as u32);
            pixel.blend(&color);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn recent_image_error() {
        let result = internal_generate_recent_image(2.to_string());
        assert!(result.is_err());
    }
}
