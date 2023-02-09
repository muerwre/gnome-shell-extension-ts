import { ActorAlign } from "@gi-types/clutter10";
import type Gio from "@gi-types/gio2";
import { Label } from "@gi-types/st1";

const { getSettings } = imports.misc.extensionUtils;
const t = imports.misc.extensionUtils.gettext;

export class Indicator extends imports.ui.panelMenu.Button {
    // Settings
    private settings: Gio.Settings;
    // const settingsValues = unpackSettings(this.settings);

    // Label
    private label: Label;

    // Construct the indicator
    constructor() {
        // Initialize the button
        super(
            0, // Menu alignment
            t("Whats Up"), // Name of the button
            true, // Don't create the menu?
        );

        // Obtain and unpack the settings
        this.settings = getSettings();
        console.log(this.settings);

        // Add the label
        this.label = new Label({
            text: "Hello World",
            yAlign: ActorAlign.CENTER,
        });
        this.add_child(this.label);
    }

    // Update the indicator
    update() {
        // Unpack the settings
        // Update the fields
        this.label.text = "Hello World (updated)";
    }
}
