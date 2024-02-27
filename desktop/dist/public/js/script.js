import { io } from 'socket.io-client';

const apiUrl = document.URL;
console.log(apiUrl);

const socket = io(apiUrl);
let canSendMessage = false;

socket.on('connect', () => {
  canSendMessage = true;

  console.log('Conectado ao servidor Socket.IO');
});

// Substituir por input de arquivo ou texto
// if (canSendMessage)
setTimeout(() => {
  socket.emit(
    'message',
    JSON.stringify({ client: 'Desktop', message: 'Olá, servidor!' })
  );
}, 2000);
