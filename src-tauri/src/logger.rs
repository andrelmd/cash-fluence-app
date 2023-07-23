use colored::*;
use serde_repr::{Deserialize_repr, Serialize_repr};

#[derive(Serialize_repr, Deserialize_repr, Debug)]
#[repr(u8)]
pub enum LogLevel {
    Info,
    Warn,
    Error,
    Debug,
    Query,
}

#[tauri::command]
pub async fn log(message: String, level: LogLevel) {
    let colored_message = match level {
        LogLevel::Info => message.green(),
        LogLevel::Warn => message.yellow(),
        LogLevel::Error => message.red(),
        LogLevel::Debug => message.blue(),
        LogLevel::Query => message.magenta(),
    };

    let log_level = match level {
        LogLevel::Info => "INFO",
        LogLevel::Warn => "WARN",
        LogLevel::Error => "ERROR",
        LogLevel::Debug => "DEBUG",
        LogLevel::Query => "QUERY",
    };

    println!("[{}] {}", log_level, colored_message);
}