use tauri_plugin_sql::{Migration, MigrationKind};

pub fn execute_migration() -> Migration {
    Migration {
        version: 1,
        description: "create initial table",
        sql: include_str!("./query.sql"),
        kind: MigrationKind::Up,
    }
}
