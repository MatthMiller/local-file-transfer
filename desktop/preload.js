const { dialog, contextBridge, ipcMain, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  // Allowed 'ipcRenderer' methods
  'ipcRender',
  {
    appIpAddress: () => {
      return ipcRenderer.invoke('get-app-ip-address');
    },
    // From render to main
    messageToMain: (message) => {
      ipcRenderer.send('messageToMain', message);
    },
    // From main to render
    messageFromMain: (message) => {
      ipcRenderer.on('messageFromMain', message);
    },
  }
);

ipcRenderer.on('set-app-ip-address', (event, ip) => {
  contextBridge.exposeInMainWorld('electron', {
    appIpAddress: () => {
      return ip;
    },
  });
});
