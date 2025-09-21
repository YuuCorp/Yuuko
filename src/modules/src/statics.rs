use anyhow::{Context, Result};
use once_cell::sync::Lazy;
use reqwest::Client;
use tokio::runtime::Runtime;

pub static RUNTIME: Lazy<Runtime> =
    Lazy::new(|| Runtime::new().expect("Failed to create Tokio runtime"));

pub static CLIENT: Lazy<Client> = Lazy::new(|| Client::new());

pub async fn fetch_cover(image_url: &str) -> Result<image::DynamicImage> {
    let cover_data = CLIENT
        .get(image_url)
        .send()
        .await
        .context("Failed to fetch image")?
        .bytes()
        .await
        .context("Failed to read image bytes")?;
    Ok(image::load_from_memory(&cover_data)?)
}
