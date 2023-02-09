/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import Adw from "@gi-types/adw1";
import Gio from "@gi-types/gio2";
import Gtk from "@gi-types/gtk4";

import { unpackSettings } from "./utils";

const { getSettings, initTranslations } = imports.misc.extensionUtils;
const t = imports.misc.extensionUtils.gettext;

function fillPreferencesWindow(window: Adw.PreferencesWindow) {
    // Unpack the settings
    const settings: Gio.Settings = getSettings();
    const settingsValues = unpackSettings(settings);
    // Add the page to the window
    const preferencesPage = new Adw.PreferencesPage();
    window.add(preferencesPage);

    // Add the appearance group of preferences to the page
    const appearanceGroup = new Adw.PreferencesGroup({
        title: t("Appearance"),
    });
    preferencesPage.add(appearanceGroup);
    // Prepare a string list for the next combo row
    const extensionPositionOptions = new Gtk.StringList();
    extensionPositionOptions.append(t("Left"));
    extensionPositionOptions.append(t("Center"));
    extensionPositionOptions.append(t("Right"));
    // Add a combo row for the extension position
    const extensionPositionComboRow = new Adw.ComboRow({
        title: t("Extension position"),
        subtitle: t("Position of the extension in the panel"),
        model: extensionPositionOptions,
        selected: settingsValues.extensionPosition,
    });
    // Connect the combo row with the settings
    extensionPositionComboRow.connect(
        "notify::selected",
        (cr: Adw.ComboRow) => {
            settings.set_enum("extension-position", cr.selected);
        },
    );
    appearanceGroup.add(extensionPositionComboRow);
    // Add an action row for the extension index
    const extensionIndexActionRow = new Adw.ActionRow({
        title: t("Extension index"),
        subtitle: t("Index of the extension in the panel"),
    });
    appearanceGroup.add(extensionIndexActionRow);
    // Add a spin button to the last action row
    const extensionIndexSpinButton = new Gtk.SpinButton({
        adjustment: new Gtk.Adjustment({
            lower: 0,
            upper: 10,
            step_increment: 1,
        }),
        numeric: true,
        margin_top: 10,
        margin_bottom: 10,
    });
    extensionIndexActionRow.add_suffix(extensionIndexSpinButton);
    extensionIndexActionRow.set_activatable_widget(extensionIndexSpinButton);
    // Connect the spin button with the settings
    settings.bind(
        "extension-index",
        extensionIndexSpinButton,
        "value",
        Gio.SettingsBindFlags.DEFAULT,
    );
}

// Initialize the preferences
function init(meta: { uuid: string }) {
    // Initialize translations
    initTranslations(meta.uuid);
}

export default { init, fillPreferencesWindow };
