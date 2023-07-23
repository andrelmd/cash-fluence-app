#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
mod settings;
use settings::{get_setting, save_setting};
mod logger;
use logger::log;


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            log,
            save_setting,
            get_setting
        ])
        .plugin(tauri_plugin_sql::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
