import { io } from 'socket.io-client';
import updateConnectedDevices from './updateConnectedDevices.js';
import updateHeader from './updateHeader.js';

let canSendMessage = false;

const startClient = async () => {
  const { appIpAddress } = window.ipcRender;
  const ipAddress = await appIpAddress();
  updateHeader(ipAddress);
  runServer(ipAddress);
};

const runServer = (ipAddress) => {
  const socket = io(`http://${ipAddress}:3000`);

  socket.on('connect', () => {
    canSendMessage = true;
    socket.emit('setPlatform', 'Desktop');

    console.log('Conectado ao servidor Socket.IO');

    // Como ouvir uma mensagem do servidor que está como socket.emit.broadcast('nomeDoEvento', 'mensagem')?
    socket.on('connectedDevices', (actualDevices) => {
      updateConnectedDevices(JSON.parse(actualDevices));
    });

    socket.on('sentFiles', (files) => {
      console.log(`Arquivos: ${files}`);
    });
  });

  // Meu código de interação com html aqui

  // Substituir por input de arquivo ou texto
  // if (canSendMessage)
  setTimeout(() => {
    socket.emit(
      'message',
      JSON.stringify({ client: 'Desktop', message: 'Olá, servidor!' })
    );
  }, 2000);
};
startClient();
