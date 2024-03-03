import { io } from 'socket.io-client';

const apiUrl = document.URL;
console.log(apiUrl);

const socket = io(apiUrl);
let canSendMessage = false;

socket.on('connect', () => {
  canSendMessage = true;
  socket.emit('setPlatform', 'Desktop');

  console.log('Conectado ao servidor Socket.IO');

  // Como ouvir uma mensagem do servidor que está como socket.emit.broadcast('nomeDoEvento', 'mensagem')?
  socket.on('connectedDevices', (actualDevices) => {
    console.log(`Dispositivos conectados: ${actualDevices}`);
  });

  socket.on('sentFiles', (files) => {
    console.log(`Arquivos: ${files}`);
  });
});

// Substituir por input de arquivo ou texto
// if (canSendMessage)
setTimeout(() => {
  socket.emit(
    'message',
    JSON.stringify({ client: 'Desktop', message: 'Olá, servidor!' })
  );
}, 2000);
