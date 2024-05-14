import React from 'react';
import { ToastAndroid } from 'react-native';
import { io } from 'socket.io-client';

export const GlobalContext = React.createContext();

export const GlobalStorage = ({ children }) => {
  const [socketState, setSocketState] = React.useState(null);
  const [headerStatus, setHeaderStatus] = React.useState({
    isConnected: false,
    ip: '',
  });

  const attemptToConnect = (ip) => {
    const socket = io(`http://${ip}:3000`);

    socket.on('connect', () => handleConnected(ip));
    socket.on('connect_error', (error) =>
      handleConnectedError(ip, error, socket)
    );
  };

  const handleConnected = (ip) => {
    console.log(`Conectado ao servidor ${ip}`);
    // ToastAndroid.show(`Connected to ${ip}`, ToastAndroid.SHORT);
    setHeaderStatus({
      isConnected: true,
      ip: ip,
    });
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

  return (
    <GlobalContext.Provider
      value={{ headerStatus, setHeaderStatus, attemptToConnect }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
