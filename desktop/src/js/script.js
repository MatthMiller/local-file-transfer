import { io } from 'socket.io-client';
import updateConnectedDevices from './updateConnectedDevices.js';
import updateHeader from './updateHeader.js';
import setAccordionListeners from './setAccordionListeners.js';
import updateSentFiles from './updateSentFiles.js';
import generateQRModal from './generateQRModal.js';

let canSendMessage = false;
let deviceUUID;
if (localStorage.getItem('uuid')) {
  deviceUUID = localStorage.getItem('uuid');
} else {
  deviceUUID = self.crypto.randomUUID();
  localStorage.setItem('uuid', deviceUUID);
}
console.log('deviceUUID:', deviceUUID);

// Ativa função para lidar com Accordion
setAccordionListeners();

const startClient = async () => {
  const { appIpAddress } = window.ipcRender;
  const ipAddress = await appIpAddress();
  updateHeader(ipAddress);
  // Ativa listener de modal de QR Code
  generateQRModal(ipAddress);
  runServer(ipAddress);
};

let socket = null;
const runServer = (ipAddress) => {
  socket = io(`http://${ipAddress}:3000`);

  socket.on('connect', () => {
    canSendMessage = true;
    socket.emit('setPlatform', 'Desktop');

    console.log('Conectado ao servidor Socket.IO');

    socket.on('connectedDevices', (actualDevices) => {
      updateConnectedDevices(JSON.parse(actualDevices));
      updateUploadEventListeners();
    });

    socket.on('sentFiles', (files) => {
      console.log(`Arquivos: ${files}`);
      updateSentFiles(JSON.parse(files), deviceUUID);
    });
  });

  // Substituir por input de texto
  // if (canSendMessage)
  setTimeout(() => {
    socket.emit(
      'message',
      JSON.stringify({ client: 'Desktop', message: 'Olá, servidor!' })
    );
  }, 2000);
};
startClient();

const uploadFile = async () => {
  const { originalName, base64, fileUUID, fileSize } = await pickSingleFile();

  if (socket) {
    socket.emit(
      'uploadFile',
      JSON.stringify({
        originalName: originalName,
        buffer: base64,
        fileUUID,
        fileSize,
        deviceUUID,
      })
    );
  }
};

const pickSingleFile = async () => {
  const [fileHandle] = await window.showOpenFilePicker();
  const file = await fileHandle.getFile();
  const originalName = file.name;
  const fileSize = file.size;
  const fileUUID = self.crypto.randomUUID();
  if (socket) {
    // Apenas para avisar que o arquivo está chegando
    // falta só chegar o base64 (função uploadFile)
    socket.emit(
      'uploadFile',
      JSON.stringify({
        originalName,
        buffer: null,
        fileUUID,
        fileSize,
        deviceUUID,
      })
    );
  }
  // Processo demorado
  const base64 = await getBase64(file);

  return { originalName, base64, fileUUID, fileSize };
};

function getBase64(file) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      resolve(reader.result.split(',')[1]);
    };

    reader.onerror = (error) => {
      reject(error);
    };
  });
}

const eventClickUploadCallback = () => {
  uploadFile();
};

const updateUploadEventListeners = () => {
  const uploadButtons = document.querySelectorAll('.upload-button');

  uploadButtons.forEach((actualButton) => {
    actualButton.removeEventListener('click', eventClickUploadCallback);
    actualButton.addEventListener('click', eventClickUploadCallback);
  });
};
