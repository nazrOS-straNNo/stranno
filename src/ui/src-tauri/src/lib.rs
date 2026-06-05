use tauri::Manager;

/// Получить версию nazrOS CORE
#[tauri::command]
fn версия_ядра() -> String {
    "nazrOS CORE v0.1.0".to_string()
}

/// Статус ядра
#[tauri::command]
fn статус_ядра() -> serde_json::Value {
    serde_json::json!({
        "стабильно": true,
        "версия": "0.1.0",
        "память_мб": 0,
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![версия_ядра, статус_ядра])
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("ошибка запуска СТРАННО");
}
