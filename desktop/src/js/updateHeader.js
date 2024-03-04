const updateHeader = (ipAddress) => {
  const serverAddressElement = document.querySelector('#js-server-address');
  serverAddressElement.innerText = ipAddress;
};

export default updateHeader;
