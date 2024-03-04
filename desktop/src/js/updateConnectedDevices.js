const updateConnectedDevices = (connectedDevices) => {
  console.log('dispositivos conectados:', connectedDevices);
  // id = js-server-address
  const connectedDevicesElement = document.querySelector(
    '#js-connected-devices'
  );

  const connectedDevicesWithoutDesktop = connectedDevices.filter(
    ({ device }) => device !== 'Desktop'
  );

  // Se estiver vazio a array acima, mostrar texto de que ainda não há dispositivos conectados
  // O botão de upload para o dispositivo vai subir o fileLink com uma propriedade
  // de id da conexão, que eu tenho acesso no device.id. Ja devo estar puxando la
  // então é só ver no front-end se o id do dispositivo (socket.id) é igual ao id da conexão (da
  // lista de links)

  connectedDevicesElement.innerHTML = connectedDevicesWithoutDesktop.map(
    (device) => {
      return `<li>${device.id} - ${device.device}</li>`;
    }
  );
};

export default updateConnectedDevices;
