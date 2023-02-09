/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import type Gio from "@gi-types/gio2";
import GLib from "@gi-types/glib2";
import GObject from "@gi-types/gobject2";

import { Indicator } from "./indicator";

const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const { getSettings, initTranslations } = imports.misc.extensionUtils;

// Indicator
const IndicatorGObjectClass = GObject.registerClass(Indicator);

// Extension
class Extension {
    // UUID of the extension
    private readonly uuid: string;
    // Settings
    private settings: Gio.Settings | null = null;
    // Signals
    private signals: number[] = [];
    // Extension position
    private extensionPosition: "left" | "center" | "right" | null = null;
    // Extension index
    private extensionIndex: number | null = null;
    // Indicator
    private indicator: any;
    // Timeout source
    private timeout: number | null = null;

    // Construct the extension
    constructor(uuid: string) {
        this.uuid = uuid;
    }

    // Enable the extension
    enable() {
        // Try to obtain the settings
        this.settings = getSettings();

        // If that's successful
        if (this.settings) {
            // Get the extensions position
            this.extensionPosition = Extension.getExtensionPosition(
                this.settings,
            );

            // Get the extension index
            this.extensionIndex = this.settings.get_int("extension-index");

            // Add the indicator
            this.addIndicator();

            // Update the indicator on any change to counter settings
            for (const key of [
                "format-string",
                "birth-year",
                "birth-month",
                "birth-day",
                "life-expectancy",
            ]) {
                const handlerId = this.settings.connect(
                    `changed::${key}`,
                    () => {
                        this.indicator.update();
                    },
                );
                this.signals.push(handlerId);
            }

            // Recreate the indicator in case the extension position is changed
            {
                const handlerId = this.settings.connect(
                    "changed::extension-position",
                    () => {
                        if (this.settings) {
                            this.extensionPosition =
                                Extension.getExtensionPosition(this.settings);
                            this.removeIndicator();
                            this.addIndicator();
                        }
                    },
                );
                this.signals.push(handlerId);
            }

            // Recreate the indicator in case the extension index is changed
            {
                const handlerId = this.settings.connect(
                    "changed::extension-index",
                    () => {
                        if (this.settings) {
                            this.extensionIndex =
                                this.settings.get_int("extension-index");
                            this.removeIndicator();
                            this.addIndicator();
                        }
                    },
                );
                this.signals.push(handlerId);
            }
        }
    }

    // Add the indicator to the panel
    addIndicator() {
        // Initialize a new indicator
        this.indicator = new IndicatorGObjectClass();

        // If the extension index and extension position are defined
        if (this.extensionIndex != null && this.extensionPosition) {
            // Add the indicator to the panel
            Main.panel.addToStatusArea(
                // Role
                this.uuid,
                // Indicator
                this.indicator,
                // Index
                this.extensionIndex,
                // Position
                this.extensionPosition,
            );
        }

        // Update the indicator every second
        this.timeout = Mainloop.timeout_add_seconds(1, () => {
            // Update the indicator
            this.indicator.update();
            // Leave the source in the main loop
            return GLib.SOURCE_CONTINUE;
        });
    }

    // Remove the indicator from the panel
    removeIndicator() {
        // If the timeout is set
        if (this.timeout) {
            // Remove the timeout
            Mainloop.source_remove(this.timeout);
            this.timeout = null;
        }

        // If the indicator exists
        if (this.indicator) {
            // Free the GObject
            this.indicator.destroy();

            // Stop tracing it
            this.indicator = null;
        }
    }

    // Disable the extension
    disable() {
        // Reset the default values of some fields
        this.extensionPosition = null;
        this.extensionIndex = null;
        // If there are connected signals, disconnect them
        if (this.settings) {
            for (const handlerId of this.signals) {
                this.settings.disconnect(handlerId);
            }
            this.settings = null;
        }
        this.signals = [];
        // Remove the indicator
        this.removeIndicator();
    }

    // Get the extension position from the settings
    static getExtensionPosition(settings: Gio.Settings) {
        switch (settings.get_enum("extension-position")) {
            case 0:
                return "left";
            case 1:
                return "center";
            case 2:
                return "right";
            default:
                return "right";
        }
    }
}

// Initialize the extension
export default function init(meta: { uuid: string }): Extension {
    // Initialize translations
    initTranslations(meta.uuid);
    // Construct and return the extension
    return new Extension(meta.uuid);
}
