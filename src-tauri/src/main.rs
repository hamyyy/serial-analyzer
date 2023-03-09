// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, PhysicalSize};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![])
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            window.set_always_on_top(true).expect("Failed to set always on top");
            window.set_always_on_top(false).expect("Failed to set always on top");
            window.center().expect("Failed to center window");
            window.set_min_size(Some(PhysicalSize { width: 300, height: 300 })).expect("Failed to set min size");

            // check if debug
            if cfg!(debug_assertions) {
                window.set_title("Serial Analyzer (Debug)").expect("Failed to set title");
                window.open_devtools();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
