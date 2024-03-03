import express from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import http from 'http';
import createError from 'http-errors';
import { expressPort } from '../package.json';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import fs, { writeFile } from 'fs';
import ip from 'ip';

const app = express();
// const router = express.Router();
// 🐱‍🐉🐱‍🐉🌟
// Gerador de QRCode pelo JavaScript (20kb): https://davidshimjs.github.io/qrcodejs/

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

//  http://192.168.15.50:3000/files/teste.txt
app.set('files', path.join(__dirname, '..', 'files'));

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

let connectedDevicesList: any = [];
let links: any = [];

io.on('connection', (socket: any) => {
  console.log('! Um cliente se conectou. !');

  const isAlreadyConnected =
    connectedDevicesList.filter((device: any) => device.id === socket.id)
      .length === 1;
  console.log(socket.id, 'já está conectado?', isAlreadyConnected);
  if (!isAlreadyConnected) {
    connectedDevicesList.push({
      device: 'undefined',
      id: socket.id,
    });
    socket.broadcast.emit(
      'connectedDevices',
      JSON.stringify(connectedDevicesList)
    );
  }

  connectedDevicesList.forEach((device: any) => {
    console.log(JSON.stringify(device));
  });

  socket.on('setPlatform', (plaftorm: any) => {
    if (plaftorm === 'Desktop') {
      connectedDevicesList = connectedDevicesList.map((device: any) => {
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
        connectedDevicesList = connectedDevicesList.map((device: any) => {
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

    connectedDevicesList.forEach((device: any) => {
      console.log(JSON.stringify(device));
    });

    socket.broadcast.emit(
      'connectedDevices',
      JSON.stringify(connectedDevicesList)
    );
  });

  socket.on('disconnect', () => {
    console.log(`O cliente ${socket.id} se desconectou.`);

    connectedDevicesList = connectedDevicesList.filter(
      (device: any) => device.id !== socket.id
    );

    socket.broadcast.emit(
      'connectedDevices',
      JSON.stringify(connectedDevicesList)
    );
  });

  // Manipule as mensagens recebidas do cliente
  socket.on('uploadFile', (file: any) => {
    try {
      const fileObject = JSON.parse(file);
      const newFile = Buffer.from(fileObject.buffer, 'base64');
      const extension = fileObject.originalName.split('.').pop();
      const fileName = uuidv4() + '.' + extension;
      const dirPath = path.join(__dirname, '..', 'public', 'files');
      const filePath = path.join(dirPath, fileName);
      // Cria o diretório caso não exista
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      links.push({
        fileName,
        originalName: fileObject.originalName,
        sentFromId: socket.id,
        sentFromName: connectedDevicesList.filter(
          (device: any) => device.id === socket.id
        )[0].device,
        alreadyUploaded: false,
      });

      socket.broadcast.emit('sentFiles', JSON.stringify(links));

      writeFile(filePath, newFile, (err) => {
        if (err) throw err;
      });

      console.log('\nRecebido arquivo:', fileObject.originalName);
      console.log('\nSalvando em:', filePath);

      links = links.map((link: any) => {
        if (link.fileName === fileName) {
          return {
            ...link,
            alreadyUploaded: true,
            fileLink: `http://${ip.address()}:${app.get(
              'port'
            )}/files/${fileName}`,
          };
        }
        return link;
      });

      // links.push({
      //   fileName,
      //   originalName: fileObject.originalName,
      //   sentFromId: socket.id,
      //   sentFromName: connectedDevicesList.filter(
      //     (device: any) => device.id === socket.id
      //   )[0].device,
      //   alreadyUploaded: true,
      //   fileLink: `http://${ip.address()}:${app.get('port')}/files/${fileName}`,
      // });

      socket.broadcast.emit('sentFiles', JSON.stringify(links));
    } catch (error) {
      console.log(error);
    }
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
