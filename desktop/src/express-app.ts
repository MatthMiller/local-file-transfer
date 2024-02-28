import express from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import http from 'http';
import createError from 'http-errors';
import { expressPort } from '../package.json';
import { Server } from 'socket.io';

const app = express();
// const router = express.Router();

// 🐱‍🐉🐱‍🐉🌟
// Próxima coisa a testar: upload de imagem pelo React Native
// https://socket.io/pt-br/how-to/upload-a-file

// Ao iniciar a API deletar todos os arquivos temporários?

// Ver uma forma de separar os arquivos recebidos
// via websockets em uma pasta específica com uuid,
// e depois retornar o link para download do arquivo.
// Só preciso salvar o arquivo na máquina do Electron
// React native -> Electron: salvando arquivo do celular no pc (temporariamente)
// Electron -> React Native: movendo/upando arquivo do pc para pasta no pc (temporariamente)

// 🌞 Puxando diretório temporário para salvar
// const { app } = require('electron')
// console.log(app.getPath('userData')) // Retorna o diretório de dados do usuário
// console.log(app.getPath('temp')) // Retorna o diretório temporário

// 🐱‍🐉🐱‍🐉🌟

app.set('port', expressPort);
app.set('views', path.join(__dirname, '..', 'views'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

app.use((_req, _res, next) => next(createError(404)));
app.use((err: any, req: any, res: any, _next: any) => {
  res.locals.title = 'error';
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500).render('error');
});

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket: any) => {
  console.log('Um cliente se conectou via Socket.IO');

  // Manipule as mensagens recebidas do cliente
  socket.on('message', (message: any) => {
    console.log(`Recebido: ${message}`);
    // Lide com a mensagem recebida (por exemplo, transferência de arquivo)
    // Envie uma resposta para o cliente (pode ser um ACK, etc.)
    socket.emit('message', 'Mensagem recebida com sucesso!');

    // if message.type === 'file' ... salvar arquivo e retornar link
  });
});

function handleServerError(error: any) {
  if (error.syscall !== 'listen') throw error;

  const bind =
    typeof expressPort === 'string'
      ? `Pipe ${expressPort}`
      : `Port ${expressPort}`;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function shutdown() {
  console.log('Shutting down Express server...');
  server.close();
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

server.listen(expressPort);
server.on('error', handleServerError);
server.on('listening', () => console.log(`Listening on: ${expressPort}`));
server.on('close', () => console.log('Express server closed.'));
