
var electron = require('electron');

var app           = electron.app
  , BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') app.quit();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {

  // Create the browser window
  mainWindow = new BrowserWindow({

    // initial window size
    width: 1280,
    height: 720,

    // minimum window width
    minWidth: 600,

    // show window in the center of the screen
    center: true,

    // window title
    title: 'GRABBIX',

    // forces using dark theme for the window, only works on some GTK+3 desktop environments
    darkTheme: true

  });

  // and load the index.html of the app
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // open developer tools on bottom
  mainWindow.webContents.openDevTools({
    mode: 'bottom'
  });

  // emitted when the window is closed
  mainWindow.on('closed', function() {

    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;

  });

});
