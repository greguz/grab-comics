// require("electron-debug")({ showDevTools: true });

// require("electron").app.on("ready", () => {
//   let installExtension = require("electron-devtools-installer");
//   installExtension
//     .default(installExtension.VUEJS_DEVTOOLS)
//     .then(() => {})
//     .catch(err => {
//       console.log("Unable to install `vue-devtools`: \n", err);
//     });
// });

import { app, BrowserWindow } from "electron";

import "./ipc";

// if (process.env.NODE_ENV !== 'development') {
//   global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
// }

let mainWindow;

// const winURL =
//   process.env.NODE_ENV === "development"
//     ? `http://localhost:9080`
//     : `file://${__dirname}/index.html`;

const winURL = `file://${__dirname}/index.html`;

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 550,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(winURL);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
