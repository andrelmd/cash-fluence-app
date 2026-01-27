use tauri_plugin_sql::{Migration, MigrationKind};

pub fn execute_migration() -> Migration {
    Migration {
        version: 4,
        description: "add multi-category support for recurrences and transactions",
        sql: include_str!("./query.sql"),
        kind: MigrationKind::Up,
    }
}
