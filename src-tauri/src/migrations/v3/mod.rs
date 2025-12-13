use tauri_plugin_sql::{Migration, MigrationKind};

pub fn execute_migration() -> Migration {
    Migration {
        version: 3,
        description: "adds installment_code to transactions",
        sql: include_str!("./query.sql"),
        kind: MigrationKind::Up,
    }
}
