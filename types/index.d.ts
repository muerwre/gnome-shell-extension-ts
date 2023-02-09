import { Actor } from "@gi-types/clutter10";
import { Settings } from "@gi-types/gio2";
// https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html#identifying-global-modifying-modules

declare class Button extends Actor {
    constructor(align: number, title: string, enableMenu: boolean);
}

declare global {
    export const imports: {
        mainloop: {
            timeout_add_seconds: (seconds: number, cb: () => void) => number;
            source_remove: (timeoutId: number) => void;
        };
        misc: {
            extensionUtils: {
                initTranslations: (domain: string) => void;
                getCurrentExtension: () => unknown;
                openPrefs: () => void;
                getSettings: () => Settings;
                gettext: (arg: string) => string;
            };
            config: unknown;
        };
        ui: {
            main: {
                notify: (arg: string) => void;
                panel: {
                    addToStatusArea: (
                        role,
                        indicator,
                        position: number,
                        box: "left" | "center" | "right",
                    ) => indicator;
                };
            };
            panelMenu: {
                Button: typeof Button;
            };
        };
    };
}

export {};
