use serde::Deserialize; // Importe a macro Deserialize
use std::fs::File;
use std::io::prelude::*;
use std::path::PathBuf;

#[derive(Deserialize)] // Adicione a macro Deserialize à estrutura
pub struct SettingValue {
    pub setting: String,
    pub value: String,
}

#[tauri::command]
pub async fn save_setting(setting_value: SettingValue) -> Result<(), String> {
    // Formate a configuração e valor em uma string que será salva no arquivo
    let config_string = format!("{}={}\n", setting_value.setting, setting_value.value);

    // Especifique o caminho do arquivo onde será salvo
    let file_path: PathBuf = "config.txt".into();

    // Abra o arquivo em modo de escrita e salve a configuração
    let mut file = File::create(file_path).map_err(|e| e.to_string())?;
    file.write_all(config_string.as_bytes())
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn get_setting(setting: String) -> Result<Option<String>, String> {
    // Especifique o caminho do arquivo de configuração
    let file_path: PathBuf = "config.txt".into();

    // Verifique se o arquivo existe
    if !file_path.exists() {
        return Ok(None);
    }

    // Abra o arquivo em modo de leitura e procure pela configuração
    let file = File::open(file_path).map_err(|e| e.to_string())?;
    let reader = std::io::BufReader::new(file);

    for line in reader.lines() {
        let line = line.map_err(|e| e.to_string())?;
        let parts: Vec<&str> = line.split('=').collect();
        if parts.len() == 2 && parts[0] == setting {
            return Ok(Some(parts[1].to_string()));
        }
    }

    // Configuração não encontrada
    Ok(None)
}
