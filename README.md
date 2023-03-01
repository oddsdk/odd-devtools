# Webnative Devtools

> A browser devtools extension to help developers who are using the [Webnative SDK](https://webnative.dev/)

## Set up

Install the dependencies

```
npm install
```

## Build

The build produces Firefox and Chrome extensions in the `dist` directory.

```
npm run build
```

## Development

### Chrome

The Chrome extension can be loaded at `chrome://extensions/`. Make sure the "Developer mode" toggle at the top right is enabled.

Select "Load unpacked". Find the directory with the built Chrome extension and select it.

Open a web app that is using Webnative with `debug` set to `true`. In the devtools, select the Webnative panel. The devtools will attempt to connect to Webnative when the panel is shown. It will attempt to disconnect when another panel is shown or the devtools are closed.

The extension will listen for `data` messages after the extension has successfully connected with Webnative.

### Firefox

The Firefox extension can be loaded at `about:debugging`. Select "This Firefox", then "Load Temporary Add-on". Find the directory with the Firefox build and select `manifest.json` and "Open".

Firefox requires an extra permission step. Open `about:addons` and find the extension. Select it and in the permissions tab toggle "Access your data for all websites" on.

Then test the plugin as you would in Chrome.
