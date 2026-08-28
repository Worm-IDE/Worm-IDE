const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    useContentSize: true, // Forces layout to honor canvas aspects
    autoHideMenuBar: true, // Removes standard browser layout lines
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Direct layout shell to load our local bundle
  mainWindow.loadFile(path.join(__dirname, 'runtime.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
