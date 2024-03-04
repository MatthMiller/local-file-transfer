const updateConnectedDevices = (connectedDevices) => {
  console.log('dispositivos conectados:', connectedDevices);
  // id = js-server-address
  const connectedDevicesElement = document.querySelector(
    '#js-accordion-content'
  );

  const connectedDevicesCounter = document.querySelector(
    '#js-connected-devices-counter'
  );

  const connectedDevicesWithoutDesktop = connectedDevices.filter(
    ({ device }) => device !== 'Desktop'
  );

  connectedDevicesCounter.innerText = `(${connectedDevicesWithoutDesktop.length})`;

  // Se estiver vazio a array acima, mostrar texto de que ainda não há dispositivos conectados
  // O botão de upload para o dispositivo vai subir o fileLink com uma propriedade
  // de id da conexão, que eu tenho acesso no device.id. Ja devo estar puxando la
  // então é só ver no front-end se o id do dispositivo (socket.id) é igual ao id da conexão (da
  // lista de links)

  // Descomentar depois com o código correto de acordo com o css
  connectedDevicesElement.innerHTML = connectedDevicesWithoutDesktop.map(
    ({ device, id }) => {
      return `
      <div data-id="${id}" class="utils-accordion-item">
      <div class="utils-accordion-item-left">
        <div class="utils-accordion-icon-container">
          <img src="./icons/smartphone.svg">
        </div>
        <div class="utils-accordion-item-device-info">
          <p class="utils-accordion-item-model">${device} <span>(${id.slice(
        0,
        6
      )})</span></p>
          <p class="utils-accordion-item-status">STATUS: <span>CONNECTED</span></p>
        </div>
      </div>
      <div class="utils-accordion-item-right">
        <button class="utils-grey-button-only-icon">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="current" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.5 19.25L15.2167 17.9667L16.6604 16.5H12.8333V14.6667H16.6604L15.2167 13.2L16.5 11.9167L20.1667 15.5833L16.5 19.25ZM2.75 19.25V5.50001C2.75 4.99584 2.92951 4.56424 3.28854 4.20521C3.64757 3.84619 4.07917 3.66667 4.58333 3.66667H15.5833C16.0875 3.66667 16.5191 3.84619 16.8781 4.20521C17.2372 4.56424 17.4167 4.99584 17.4167 5.50001V10.1521C17.2639 10.1215 17.1111 10.1024 16.9583 10.0948C16.8056 10.0872 16.6528 10.0833 16.5 10.0833C16.3472 10.0833 16.1944 10.0872 16.0417 10.0948C15.8889 10.1024 15.7361 10.1215 15.5833 10.1521V5.50001H4.58333V14.6667H11.0687C11.0382 14.8194 11.0191 14.9722 11.0115 15.125C11.0038 15.2778 11 15.4306 11 15.5833C11 15.7361 11.0038 15.8889 11.0115 16.0417C11.0191 16.1944 11.0382 16.3472 11.0687 16.5H5.5L2.75 19.25ZM6.41667 9.16667H13.75V7.33334H6.41667V9.16667ZM6.41667 12.8333H11V11H6.41667V12.8333Z" fill="#9B9B9B" />
          </svg>
        </button>
        <button class="utils-grey-button upload-button">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="current" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.0834 17.4167H11.9167V13.5896L13.3834 15.0562L14.6667 13.75L11.0001 10.0833L7.33341 13.75L8.63966 15.0333L10.0834 13.5896V17.4167ZM5.50008 20.1667C4.99591 20.1667 4.56432 19.9871 4.20529 19.6281C3.84626 19.2691 3.66675 18.8375 3.66675 18.3333V3.66666C3.66675 3.16249 3.84626 2.7309 4.20529 2.37187C4.56432 2.01284 4.99591 1.83333 5.50008 1.83333H12.8334L18.3334 7.33333V18.3333C18.3334 18.8375 18.1539 19.2691 17.7949 19.6281C17.4358 19.9871 17.0042 20.1667 16.5001 20.1667H5.50008ZM11.9167 8.25V3.66666H5.50008V18.3333H16.5001V8.25H11.9167Z" fill="#9B9B9B" />
          </svg>
          <p>Send File</p>
        </button>
      </div>
    </div>
      `;
    }
  );
};

export default updateConnectedDevices;
