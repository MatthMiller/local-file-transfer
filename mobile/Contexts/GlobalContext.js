import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import * as Device from 'expo-device';
import React from 'react';
import { ToastAndroid } from 'react-native';
import { io } from 'socket.io-client';

export const GlobalContext = React.createContext();

export const GlobalStorage = ({ children }) => {
  const [deviceUUID, setDeviceUUID] = React.useState(null);
  const [socketState, setSocketState] = React.useState(null);
  const [headerStatus, setHeaderStatus] = React.useState({
    isConnected: false,
    ip: '',
  });

  const attemptToConnect = (ip) => {
    const socket = io(`http://${ip}:3000`);

    socket.on('connect', () => handleConnected(ip, socket));
    socket.on('connect_error', (error) =>
      handleConnectedError(ip, error, socket)
    );
  };

  const handleConnected = (ip, socket) => {
    console.log(`Conectado ao servidor ${ip}`);

    setHeaderStatus({
      isConnected: true,
      ip: ip,
    });
    socket.emit('setPlatform', JSON.stringify({ modelName: Device.modelName }));
    // Expo get device info
    // socket.emit('setPlatform', JSON.stringify(deviceInfo));
  };

  const handleConnectedError = (ip, error, socket) => {
    console.log(`Error connecting to  ${ip}\n. ${error}`);
    ToastAndroid.show(`Error connecting to ${ip}`, ToastAndroid.SHORT);

    setHeaderStatus({
      isConnected: false,
      ip: '',
    });

    socket.disconnect();
  };

  React.useEffect(() => {
    configureDeviceUUID();
  }, []);

  const configureDeviceUUID = async () => {
    const uuidStorage = await AsyncStorage.getItem('deviceUUID');
    // console.log('uuidStorage:', uuidStorage);
    if (uuidStorage === null) {
      const uuid = Crypto.randomUUID();
      await AsyncStorage.setItem('deviceUUID', uuid);
    } else {
      setDeviceUUID(uuidStorage);
    }
  };

  return (
    <GlobalContext.Provider
      value={{ headerStatus, setHeaderStatus, attemptToConnect }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
