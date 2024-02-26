import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import io from 'socket.io-client';

const App = () => {
  useEffect(() => {
    const socket = io('http://192.168.15.50:3000'); // Substitua 'seu-ip' pelo IP do seu servidor

    socket.on('connect', () => {
      console.log('Conectado ao servidor Socket.IO');

      // Envie uma mensagem para o servidor (pode ser um arquivo ou texto)
      socket.emit('message', 'Olá, servidor!');
    });

    socket.on('message', (message) => {
      console.log(`Recebido: ${message}`);
      // Lide com a resposta recebida do servidor (pode ser um ACK, etc.)
    });

    socket.on('disconnect', (reason) => {
      console.log(`Desconectado: ${reason}`);
    });

    // Feche a conexão quando o componente for desmontado
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <View>
      <Text>Exemplo de Cliente Socket.IO em React Native</Text>
    </View>
  );
};

export default App;
