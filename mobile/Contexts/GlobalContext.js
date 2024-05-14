import React from 'react';

export const GlobalContext = React.createContext();

export const GlobalStorage = ({ children }) => {
  // const [socket, setSocket] = React.useState(null);
  const [headerStatus, setHeaderStatus] = React.useState({
    isConnected: false,
    ip: '',
  });

  return (
    <GlobalContext.Provider value={{ headerStatus, setHeaderStatus }}>
      {children}
    </GlobalContext.Provider>
  );
};
