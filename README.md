### Description

Gnome Shell "Hello World" extension, built with Typescript, based on
[paveloom-t's Memento Mori](https://github.com/paveloom-t/gnome-shell-memento-mori) extension.

#### Work In Progress

-   Will fix typings later

#### Building and developing

-   Install `nodejs >= 16.0.0`;
-   Build it with `yarn build`;
-   Run `yarn symlink` to install extension for current user;
-   Log out and log in back;
-   Enable extension with `gnome-extensions enable whats-up@muerwre`;
-   Run `yarn launch` every time you want to test it;
-   Prepare the package to upload with `yarn run build:package`;

#### Translations

-   Run `yarn gen:locale` to find all usages of `t("Text")`, fill translations and run it again;
-   To add a translation, contribute a `.po` file. See [`resources/po`](resources/po) for examples;
