#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use colored::*;
use serde_repr::{Deserialize_repr, Serialize_repr};

#[derive(Serialize_repr, Deserialize_repr, Debug)]
#[repr(u8)]
enum LogLevel {
  Info,
  Warn,
  Error,
}

#[tauri::command]
async fn log(message: String, level: LogLevel) {
    let colored_message = match level {
        LogLevel::Info => message.green(),
        LogLevel::Warn => message.yellow(),
        LogLevel::Error => message.red(),
    };

    let log_level = match level {
        LogLevel::Info => "INFO",
        LogLevel::Warn => "WARN",
        LogLevel::Error => "ERROR",
    };

    println!("[{}] {}", log_level, colored_message);
}
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![log])
        .plugin(tauri_plugin_sql::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
