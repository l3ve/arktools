use std::{fs::File, io::Read};
use tauri::{
    async_runtime::spawn,
    generate_context,
    ActivationPolicy::Accessory,
    Manager, RunEvent,
    SystemTrayEvent::{LeftClick, MenuItemClick},
    WindowBuilder, WindowEvent, WindowUrl,
};
mod menu;
use arboard::Clipboard;
use livesplit_hotkey::{Hook, Hotkey, KeyCode, Modifiers};
use tokio::time::{sleep, Duration};

#[tauri::command]
fn get_clipboard() -> String {
    let mut clipboard = Clipboard::new().unwrap();
    println!("Clipboard text was: {}", clipboard.get_text().unwrap());
    return clipboard.get_text().unwrap();
}

fn main() {
    let hook = Hook::new().unwrap();
    hook.register(
        Hotkey {
            key_code: KeyCode::KeyC,
            modifiers: Modifiers::META,
        },
        || {
            spawn(async {
                sleep(Duration::from_secs(1)).await;
                let mut clipboard = Clipboard::new().unwrap();
                println!("Clipboard text was: {}", clipboard.get_text().unwrap());
            });
        },
    )
    .unwrap();

    tauri::Builder::default()
        .setup(|app| {
            WindowBuilder::new(app, "main", WindowUrl::App("http://localhost:3333/".into()))
                .inner_size(300.0, 500.0)
                .decorations(false)
                .visible(false)
                .always_on_top(true)
                .transparent(true)
                .resizable(false)
                .fullscreen(false)
                .build()
                .unwrap();

            app.set_activation_policy(Accessory);
            // app.get_window("main").unwrap().open_devtools();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_clipboard])
        .system_tray(menu::get_tray_menu())
        .on_system_tray_event(|app, event| match event {
            LeftClick { position, .. } => {
                // 定位用
                let window = app.get_window("main").unwrap();
                window.hide().unwrap();
                window.set_position(position).unwrap();
            }
            MenuItemClick { id, .. } => match id.as_str() {
                "quit" => {
                    std::process::exit(0);
                }
                "time" => {
                    let mut clipboard = Clipboard::new().unwrap();
                    println!("Clipboard text was: {}", clipboard.get_text().unwrap());
                }
                "copy" => {
                    let window = app.get_window("main").unwrap();
                    window.show().unwrap();
                    window.set_focus().unwrap();
                    window.set_always_on_top(true).unwrap();
                }
                _ => {}
            },
            _ => {}
        })
        .on_window_event(|event| match event.event() {
            WindowEvent::CloseRequested { api, .. } => {
                event.window().hide().unwrap();
                api.prevent_close();
            }
            WindowEvent::Focused(focused) => {
                if !focused {
                    event.window().hide().unwrap();
                }
            }
            _ => {}
        })
        .build(generate_context!())
        .expect("error while running tauri application")
        .run(|_app_handle, event| match event {
            RunEvent::ExitRequested { api, .. } => {
                api.prevent_exit();
            }
            _ => {}
        });
}

fn _get_js_content(file_path: &str) -> String {
    let mut file = File::open(file_path).unwrap();
    let mut common = String::new();
    file.read_to_string(&mut common).unwrap();
    return common;
}
