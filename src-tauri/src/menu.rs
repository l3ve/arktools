use tauri::{CustomMenuItem, SystemTray, SystemTrayMenu, SystemTrayMenuItem};

pub fn get_tray_menu() -> SystemTray {
    let copy = CustomMenuItem::new("copy".to_string(), "粘贴管理");
    let time = CustomMenuItem::new("time".to_string(), "时间管理大师(开发中)");
    let quit = CustomMenuItem::new("quit".to_string(), "退出");
    let tray_menu = SystemTrayMenu::new()
        .add_item(copy)
        .add_item(time)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);
    let tray = SystemTray::new().with_menu(tray_menu);
    return tray;
}
