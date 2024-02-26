import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
const app = express();
const server = http.createServer(app);
const io = new Server(server);
import ip from 'ip';

// 🎃🎃🎃🎃
// Esse seria o Electron rodando. Atualmente o
// servidor está funcionando pra conectar com o Postman.
// Testar no React Native

io.on('connection', (socket) => {
  console.log('Cliente conectado ao servidor Socket.IO');

  socket.on('message', (message) => {
    console.log(`Recebido: ${message}`);

    // Aqui eu trataria os dados do client:
    // Transformaria o formado JSON string em objeto js
    // Se for file, uso buffer ou base64 pra criar o arquivo,
    // puxando a file extension

    // 'message' seria o canal de comunicação
    //  da mensagem
    // Envie uma resposta para o cliente (pode ser um ACK, etc.)
    socket.emit('message', 'Mensagem recebida com sucesso!');
  });
});

// Eu poderia fazer um socket on para verificar a cada
// 500ms se existe um arquivo pendente para enviar para
// o client. Se sim, colocar socket.emit('mobileResponse', conteudo)

const PORT = 3000;
const IP_ADRESS = ip.address();

server.listen(PORT, IP_ADRESS, () => {
  console.log(`Servidor Socket.IO rodando em ${IP_ADRESS}:${PORT}`);
});
