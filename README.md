# ODD Devtools

ODD Devtools is a browser extension for debugging applications that use the ODD SDK. It logs session and file system events across domains and app namespaces. Each event includes information about the state of an application, including ODD SDK version, data root CID, username, account DID, agent DID, and capabilities.

Get started by setting debug to true in your ODD program. Open the devtools and select the ODD SDK tab. The ODD Devtools will connect to the ODD SDK and start logging events when they occur.

ODD Devtools organizes event logs by app namespace when debugging more than one app, for example, when one app requests capabilities from another. Select a namespace from the left panel to filter events, or select "All Namespaces" to view all events.

Filter events by entering a search term into the filter input. The filter checks for matches in any event payload value. For example, you could enter "private" to only view changes to the private file system.

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

Open a web app that is using ODD SDK with `debug` set to `true`. In the devtools, select the ODD SDK panel. The devtools will connect to ODD SDK when the panel is shown and on page reloads.

The extension will listen for messages after the extension has successfully connected with the ODD SDK.

### Firefox

The Firefox extension can be loaded at `about:debugging`. Select "This Firefox", then "Load Temporary Add-on". Find the directory with the Firefox build and select `manifest.json` and "Open".

Firefox requires an extra permission step. Open `about:addons` and find the extension. Select it and in the permissions tab toggle "Access your data for all websites" on.