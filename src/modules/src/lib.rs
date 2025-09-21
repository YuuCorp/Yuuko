use image::{ImageEncoder, RgbaImage, codecs::png, imageops::FilterType};
use std::{
    ffi::{CStr, c_char, c_uchar},
    ptr,
};

use crate::statics::{RUNTIME, fetch_cover};

mod recent_image;
mod statics;

#[unsafe(no_mangle)]
/// # Safety
/// Used to later cleanup memory
pub unsafe extern "C" fn Free(ptr: *mut c_char) {
    if ptr.is_null() {
        return;
    }

    let boxed_ptr = ptr as *mut i32;

    unsafe {
        drop(Box::from_raw(boxed_ptr));
    }
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn FreeRgbaImage(ptr: *mut c_char) {
    if ptr.is_null() {
        return;
    }

    drop(unsafe { Box::from_raw(ptr as *mut RgbaImage) });
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn FreeImageBuffer(ptr: *mut c_char, len: u32) {
    if ptr.is_null() {
        return;
    }

    unsafe {
        let _ = Box::from_raw(std::slice::from_raw_parts_mut(ptr as *mut u8, len as usize));
    };
}

#[unsafe(no_mangle)]
/// # Safety
/// `json_ptr` must point to a valid null-terminated C string.
/// Returns a pointer to a heap-allocated 3x3 grid image of the user's recent media, or null on failure.
pub unsafe extern "C" fn GenerateRecentImage(json_ptr: *const c_char) -> *mut c_char {
    let _json_data = unsafe { CStr::from_ptr(json_ptr) };

    let json_data = String::from_utf8_lossy(_json_data.to_bytes()).to_string();

    let res = recent_image::internal_generate_recent_image(json_data);
    match res {
        Ok(ptr) => ptr,
        Err(err) => {
            eprintln!("{err}");
            ptr::null_mut()
        }
    }
}

#[unsafe(no_mangle)]
/// # Safety
/// `image_url` must point to a valid null-terminated C string.
/// Returns a pointer to a heap-allocated RgbaImage, or null on failure.
pub unsafe extern "C" fn GetImage(image_url: *const c_char) -> *mut c_char {
    if image_url.is_null() {
        return ptr::null_mut();
    }

    let c_str = unsafe { CStr::from_ptr(image_url) };
    let url_str = match c_str.to_str() {
        Ok(s) => s,
        Err(_) => return ptr::null_mut(),
    };

    let result = RUNTIME.block_on(fetch_cover(url_str));

    match result {
        Ok(img) => {
            // Convert to RgbaImage
            let rgba: RgbaImage = img.to_rgba8();

            let boxed = Box::new(rgba);
            Box::into_raw(boxed) as *mut c_char
        }
        Err(err) => {
            eprintln!("Failed to fetch image: {:?}", err);
            ptr::null_mut()
        }
    }
}

/// # Safety
/// `original_ptr` must be a valid pointer to a heap-allocated `RgbaImage`.
/// Returns a pointer to `Vec<u8>` image data with the pixelation applied, null if error.
/// Caller is responsible for freeing the returned pointer using `FreeImageBuffer`.
#[unsafe(no_mangle)]
pub unsafe extern "C" fn PixelateImage(
    original_ptr: *const c_char,
    level: c_uchar,
    out_size: *mut u32,
) -> *mut c_char {
    if original_ptr.is_null() || level == 0 || out_size.is_null() {
        return ptr::null_mut();
    }

    let original: &RgbaImage = unsafe { &*(original_ptr as *const RgbaImage) };
    let (width, height) = original.dimensions();
    let resize_width = (width / level as u32).max(1);
    let resize_height = (height / level as u32).max(1);

    let pixelated =
        image::imageops::resize(original, resize_width, resize_height, FilterType::Nearest);
    let pixelated = image::imageops::resize(&pixelated, width, height, FilterType::Nearest);

    let mut buf = Vec::new();
    let encoder = png::PngEncoder::new(&mut buf);
    let result = encoder.write_image(&pixelated, width, height, image::ColorType::Rgba8.into());

    match result {
        Ok(_) => {
            unsafe { *out_size = buf.len() as u32 };

            let boxed = buf.into_boxed_slice();
            let ptr = boxed.as_ptr() as *mut c_char;

            std::mem::forget(boxed);
            ptr
        }
        Err(err) => {
            eprintln!("{err}");
            ptr::null_mut()
        }
    }
}
