import { io } from 'socket.io-client';
import updateConnectedDevices from './updateConnectedDevices.js';
import updateHeader from './updateHeader.js';
import setAccordionListeners from './setAccordionListeners.js';
import updateSentFiles from './updateSentFiles.js';

let canSendMessage = false;

// Ativa função para lidar com Accordion
setAccordionListeners();

const startClient = async () => {
  const { appIpAddress } = window.ipcRender;
  const ipAddress = await appIpAddress();
  updateHeader(ipAddress);
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
      updateSentFiles(JSON.parse(files), socket.id);
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
  const { originalName, base64, uuid, fileSize } = await pickSingleFile();

  if (socket) {
    socket.emit(
      'uploadFile',
      JSON.stringify({
        originalName: originalName,
        buffer: base64,
        uuid,
        fileSize,
      })
    );
  }
};

const pickSingleFile = async () => {
  const [fileHandle] = await window.showOpenFilePicker();
  const file = await fileHandle.getFile();
  const originalName = file.name;
  const fileSize = file.size;
  const uuid = self.crypto.randomUUID();
  if (socket) {
    // Apenas para avisar que o arquivo está chegando
    // falta só chegar o base64 (função uploadFile)
    socket.emit(
      'uploadFile',
      JSON.stringify({ originalName, buffer: null, uuid, fileSize })
    );
  }
  // Processo demorado
  const base64 = await getBase64(file);

  return { originalName, base64, uuid, fileSize };
};

function getBase64(file) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.onload = function () {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
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
