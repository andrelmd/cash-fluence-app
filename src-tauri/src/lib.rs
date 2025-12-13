use dotenv::dotenv;

pub mod migrations {
    pub mod v1;
    pub mod v2;
	pub mod v3;
}

pub mod logger;

use crate::migrations::v1::execute_migration as execute_migration_v1;
use crate::migrations::v2::execute_migration as execute_migration_v2;
use crate::migrations::v3::execute_migration as execute_migration_v3;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    dotenv().ok();

	let default_db_host = "cash_fluence";
    let db_host = dotenv::var("VITE_DB_HOST").unwrap_or(default_db_host.to_string());

    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(
            tauri_plugin_sql::Builder::new()
                .add_migrations(
                    &format!("sqlite:{}.db", db_host),
                    vec![execute_migration_v1(), execute_migration_v2(), execute_migration_v3()],
                )
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![logger::log])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
