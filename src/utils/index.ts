import type Gio from "@gi-types/gio2";

export interface SettingsValues {
    extensionPosition: number;
    extensionIndex: number;
}

// Unpack the settings
export function unpackSettings(settings: Gio.Settings): SettingsValues {
    return {
        extensionPosition: settings.get_enum("extension-position"),
        extensionIndex: settings.get_int("extension-index"),
    };
}
