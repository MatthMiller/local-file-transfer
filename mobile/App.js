import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import React, { useEffect } from 'react';
import io from 'socket.io-client';

const Stack = createStackNavigator();

const App = () => {
  const [fontsLoaded] = useFonts({
    IBMPlexMonoLight: require('./assets/fonts/IBMPlexMono-Light.ttf'),
    IBMPlexMonoRegular: require('./assets/fonts/IBMPlexMono-Regular.ttf'),
    IBMPlexSansLight: require('./assets/fonts/IBMPlexSans-Light.ttf'),
    IBMPlexSansRegular: require('./assets/fonts/IBMPlexSans-Regular.ttf'),
    IBMPlexSansMedium: require('./assets/fonts/IBMPlexSans-Medium.ttf'),
    IBMPlexSansSemiBold: require('./assets/fonts/IBMPlexSans-SemiBold.ttf'),
  });

  useEffect(() => {
    const socket = io('http://192.168.15.50:3000'); // Substitua 'seu-ip' pelo IP do seu servidor

    socket.on('connect', () => {
      console.log('Conectado ao servidor Socket.IO');

      // Envie uma mensagem para o servidor (pode ser um arquivo ou texto)
      socket.emit(
        'message',
        JSON.stringify({
          client: 'Mobile',
          message: 'Olá, servidor, estou acessando do React Native com Expo!',
        })
      );
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

  if (!fontsLoaded) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='Home'
          component={HomeScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
