const updateConnectedDevices = (connectedDevices) => {
  console.log('dispositivos conectados:', connectedDevices);
  // id = js-server-address
  const connectedDevicesElement = document.querySelector(
    '#js-connected-devices'
  );

  const connectedDevicesWithoutDesktop = connectedDevices.filter(
    ({ device }) => device !== 'Desktop'
  );

  connectedDevicesElement.innerHTML = connectedDevicesWithoutDesktop.map(
    (device) => {
      return `<li>${device.id} - ${device.device}</li>`;
    }
  );
};

export default updateConnectedDevices;
