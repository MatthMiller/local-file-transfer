const { app, BrowserWindow, ipcMain } = require('electron');
const express = require('express');
const http = require('http');
const ip = require('ip');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('node:path');
const { v4: uuidv4 } = require('uuid');

const port = 3000;
const expressAppIP = ip.address();
const expressAppUrl = `http://${expressAppIP}:${port}`;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      autoHideMenuBar: true,
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('src/index.html');

  mainWindow.webContents.send('set-app-ip-address', expressAppIP);

  mainWindow.setIcon('./favicon.png');
  mainWindow.menuBarVisible = false;
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // Create an Express server
  const expressApp = express();

  expressApp.use(bodyParser.json());
  expressApp.use(bodyParser.urlencoded({ extended: false }));
  expressApp.use(express.static(path.join(__dirname, 'public')));
  expressApp.set('files', path.join(__dirname, 'public', 'files'));

  // Aponta para o arquivo. Basta trocar o text.txt por variavel
  const filesPath = path.join(__dirname, 'public', 'files');

  fs.readdir(filesPath, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      if (file !== '.gitkeep') {
        fs.unlink(path.join(filesPath, file), (err) => {
          if (err) throw err;
          console.log(`Deleted file: ${file}`);
        });
      }
    }
  });

  const server = http.createServer(expressApp);
  const io = new Server(server, {
    maxHttpBufferSize: 1e9, // 1 GB em bytes
  });

  let connectedDevicesList = [];
  let links = [];
  io.on('connection', (socket) => {
    console.log('! Um cliente se conectou. !');
    io.emit('sentFiles', JSON.stringify(links));

    const isAlreadyConnected =
      connectedDevicesList.filter((device) => device.id === socket.id)
        .length === 1;
    console.log(socket.id, 'já está conectado?', isAlreadyConnected);
    if (!isAlreadyConnected) {
      connectedDevicesList.push({
        device: 'undefined',
        id: socket.id,
      });
      io.emit('connectedDevices', JSON.stringify(connectedDevicesList));
    }

    connectedDevicesList.forEach((device) => {
      console.log(JSON.stringify(device));
    });

    socket.on('setPlatform', (plaftorm) => {
      if (plaftorm === 'Desktop') {
        connectedDevicesList = connectedDevicesList.map((device) => {
          if (device.id === socket.id) {
            return {
              ...device,
              device: 'Desktop',
            };
          }
          return device;
        });
      }

      try {
        if (JSON.parse(plaftorm) instanceof Object) {
          connectedDevicesList = connectedDevicesList.map((device) => {
            if (device.id === socket.id) {
              return {
                ...device,
                platform: 'Mobile',
                device: JSON.parse(plaftorm).modelName,
              };
            }
            return device;
          });
        }
      } catch (error) {}

      connectedDevicesList.forEach((device) => {
        console.log(JSON.stringify(device));
      });

      io.emit('connectedDevices', JSON.stringify(connectedDevicesList));
    });

    socket.on('disconnect', () => {
      console.log(`O cliente ${socket.id} se desconectou.`);

      connectedDevicesList = connectedDevicesList.filter(
        (device) => device.id !== socket.id
      );

      socket.broadcast.emit(
        'connectedDevices',
        JSON.stringify(connectedDevicesList)
      );
    });

    socket.on('uploadFile', (file) => {
      try {
        const fileObject = JSON.parse(file);
        const extension = fileObject.originalName.split('.').pop();
        const fileName = fileObject.fileUUID + '.' + extension;
        const filePath = path.join(filesPath, fileName);
        const fileSize = fileObject.fileSize;
        const deviceUUID = fileObject.deviceUUID;

        console.log(fileObject.fileUUID, fileObject, extension);

        if (fileObject.buffer === null) {
          links.push({
            fileName,
            originalName: fileObject.originalName,
            connectionID: socket.id,
            fileUUID: fileObject.fileUUID,
            deviceUUID,
            fileSize,
            sentFromName: connectedDevicesList.filter(
              (device) => device.id === socket.id
            )[0].device,
            alreadyUploaded: false,
          });
        }

        io.emit('sentFiles', JSON.stringify(links));

        if (fileObject.buffer === null) return;

        const newFile = Buffer.from(fileObject.buffer, 'base64');

        fs.writeFile(filePath, newFile, (err) => {
          if (err) throw err;
        });

        console.log('\nRecebido arquivo:', fileObject.originalName);
        console.log('\nSalvando em:', filePath);

        // Momento em que foi criado o arquivo
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours > 12 ? hours - 12 : hours;
        const strTime = [hours12, minutes, seconds].join(':') + ' ' + ampm;

        links = links.map((link) => {
          if (link.uuid === fileObject.uuid) {
            return {
              ...link,
              alreadyUploaded: true,
              fileLink: `${expressAppUrl}/files/${fileName}`,
              createdAt: {
                date: `${day}/${month}/${year}`,
                time: strTime,
              },
            };
          }
          return link;
        });

        io.emit('sentFiles', JSON.stringify(links));
      } catch (error) {
        console.log(error);
      }
    });
  });

  // Define your routes and middleware here
  expressApp.get('/', (req, res) => {
    res.send('Hello World!');
  });

  server.listen(port, expressAppIP, () => {
    console.log(`Express server listening at ${expressAppUrl}`);
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('get-app-ip-address', (event) => {
  return expressAppIP;
});

ipcMain.on('messageToMain', (event, message) => {
  console.log('Message to main: ' + message);
});
