use std::{fs::File, io::Read};
use tauri::{
    generate_context,
    ActivationPolicy::Accessory,
    Manager, RunEvent,
    SystemTrayEvent::{LeftClick, MenuItemClick},
    WindowBuilder, WindowEvent, WindowUrl,
};
mod menu;
use livesplit_hotkey::{Hook, Hotkey, KeyCode, Modifiers};

fn main() {
    let html_url = WindowUrl::App("index.html".into());
    #[cfg(debug_assertions)]
    let html_url = WindowUrl::App("http://localhost:3333/".into());

    let app = tauri::Builder::default()
        .setup(|app| {
            WindowBuilder::new(app, "main", html_url)
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
            #[cfg(debug_assertions)]
            app.get_window("main").unwrap().open_devtools();
            Ok(())
        })
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
                "time" => {}
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
        .expect("error while running tauri application");

    // 全局监听键盘事件
    let app_handle = app.app_handle();
    let hook = Hook::new().unwrap();
    hook.register(
        Hotkey {
            key_code: KeyCode::KeyC,
            modifiers: Modifiers::META,
        },
        move || {
            let window = app_handle.get_window("main").unwrap();
            window.eval("emit('clipboard-change')").unwrap();
        },
    )
    .unwrap();
    app.run(|_app_handle, event| match event {
        RunEvent::ExitRequested { api, .. } => {
            api.prevent_exit();
        }
        RunEvent::Ready => {
            println!("ArkTools Ready!");
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
