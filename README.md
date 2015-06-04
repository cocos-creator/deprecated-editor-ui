**This repo is deprecated, we are upgrate the ui to [ui-kit](https://github.com/fireball-packages/ui-kit)**

# Intro

This is the custom UI elements library built with [Polymer](https://www.polymer-project.org) for [Fireball Game Editor](https://github.com/fireball-x/fireball).

## Use Open Sourced Fireball Editor UI Library

### Prerequisite

You need to first get the following tools installed and working:

- [Nodejs v0.12+](https://nodejs.org/), if you're using a Mac, we recommend install via [NVM](https://github.com/creationix/nvm).
- [Bower](http://bower.io/), for installing Polymer and other front-end libraries.
- [gulp](http://gulpjs.com/), for bootstrap, building and running this project.

### Bootstrap

```bash
npm install
bower install
gulp standalone
```

This series of commands will setting up the project by installing dependencies, building and run the kitchen sink app (which includes all the custom elements in the project).

### Build

```bash
gulp build
```

Build the project using Polymer's [vulcanize tool](https://github.com/Polymer/vulcanize).

### Run Kitchen Sink

```bash
gulp run
```

Start an web server to run the kitchen sink app and open it in your browser.

The content shows in kitchen sink test app is all contained in [test](/test) folder. Just check the source code and learn how to add custom elements.

![kitchen sink](https://cloud.githubusercontent.com/assets/344547/7551035/83a32b70-f6ab-11e4-95c1-07720850c8f4.jpg)

## For Fireball Editor Development

If you are developing in Fireball dev environment. The tasks are a bit different:

### Install

```bash
npm install
bower install
gulp cp-core
```

### Build

```bash
gulp
```

### Run

```bash
gulp run-test
```
