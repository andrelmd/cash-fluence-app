// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
pub mod migrations {
    pub mod v1;
}

pub mod logger;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

use crate::migrations::v1::execute_migration as execute_migration_v1;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::new()
                .add_migrations("sqlite:cash_fluence.db", vec![execute_migration_v1()])
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, logger::log])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
