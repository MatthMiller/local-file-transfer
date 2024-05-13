const updateReceivedFiles = (filesArray, desktopId) => {
  const sentContentElement = document.querySelector(
    '#js-accordion-received-files-content'
  );
  const receivedFilesCounter = document.querySelector(
    '#js-received-files-counter'
  );

  console.log(filesArray, desktopId);

  const externalFiles = filesArray.filter((file) => {
    return file.deviceUUID !== desktopId;
  });
  console.log('externalFiles', externalFiles);

  receivedFilesCounter.innerText = `(${externalFiles.length})`;

  sentContentElement.innerHTML = externalFiles
    .map(({ originalName, fileLink, fileUUID, deviceUUID }) => {
      console.log(fileLink);

      return `
    <div data-id="${fileUUID}" class="utils-accordion-item">
      <div class="utils-accordion-item-left">
        <div class="utils-accordion-icon-container">
          <img src="./icons/file.svg">
        </div>
        <div class="utils-accordion-item-device-info">
          <p class="utils-accordion-item-model">${
            originalName.length >= 20
              ? // Transformar em Text...finalDotexto
                `${originalName.slice(0, 20)}...${originalName.slice(-5)}`
              : originalName
          }</p>
          <p class="utils-accordion-item-from">From: ${deviceUUID.slice(
            0,
            6
          )}</p>
        </div>
      </div>
      <div class="utils-accordion-item-right">
      ${
        fileLink
          ? `
          <!-- <button class="utils-grey-button-only-icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="current" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.125 18.3333H16.0417V14.6667H15.125V18.3333ZM15.5833 13.75C15.7056 13.75 15.8125 13.7042 15.9042 13.6125C15.9958 13.5208 16.0417 13.4139 16.0417 13.2917C16.0417 13.1694 15.9958 13.0625 15.9042 12.9708C15.8125 12.8792 15.7056 12.8333 15.5833 12.8333C15.4611 12.8333 15.3542 12.8792 15.2625 12.9708C15.1708 13.0625 15.125 13.1694 15.125 13.2917C15.125 13.4139 15.1708 13.5208 15.2625 13.6125C15.3542 13.7042 15.4611 13.75 15.5833 13.75ZM6.41667 12.8333H9.78542C9.95347 12.4819 10.1483 12.1535 10.3698 11.8479C10.5913 11.5424 10.8396 11.2597 11.1146 11H6.41667V12.8333ZM6.41667 16.5H9.23542C9.18958 16.1944 9.16667 15.8889 9.16667 15.5833C9.16667 15.2778 9.18958 14.9722 9.23542 14.6667H6.41667V16.5ZM4.58333 20.1667C4.07917 20.1667 3.64757 19.9872 3.28854 19.6281C2.92951 19.2691 2.75 18.8375 2.75 18.3333V3.66667C2.75 3.1625 2.92951 2.7309 3.28854 2.37188C3.64757 2.01285 4.07917 1.83333 4.58333 1.83333H11.9167L17.4167 7.33333V9.44167C17.1264 9.35 16.8285 9.28125 16.5229 9.23542C16.2174 9.18958 15.9042 9.16667 15.5833 9.16667V8.25H11V3.66667H4.58333V18.3333H9.78542C9.95347 18.6847 10.1483 19.0132 10.3698 19.3188C10.5913 19.6243 10.8396 19.9069 11.1146 20.1667H4.58333ZM15.5833 11C16.8514 11 17.9323 11.4469 18.826 12.3406C19.7198 13.2344 20.1667 14.3153 20.1667 15.5833C20.1667 16.8514 19.7198 17.9323 18.826 18.826C17.9323 19.7198 16.8514 20.1667 15.5833 20.1667C14.3153 20.1667 13.2344 19.7198 12.3406 18.826C11.4469 17.9323 11 16.8514 11 15.5833C11 14.3153 11.4469 13.2344 12.3406 12.3406C13.2344 11.4469 14.3153 11 15.5833 11Z" fill="#9B9B9B"/>
          </svg>
          </button> -->
          <a href="${fileLink}" download="${fileLink}" target="_blank" class="utils-grey-button download-button">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="current" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.0001 14.6667L6.41675 10.0833L7.70008 8.75417L10.0834 11.1375V3.66667H11.9167V11.1375L14.3001 8.75417L15.5834 10.0833L11.0001 14.6667ZM5.50008 18.3333C4.99591 18.3333 4.56432 18.1538 4.20529 17.7948C3.84626 17.4358 3.66675 17.0042 3.66675 16.5V13.75H5.50008V16.5H16.5001V13.75H18.3334V16.5C18.3334 17.0042 18.1539 17.4358 17.7949 17.7948C17.4358 18.1538 17.0042 18.3333 16.5001 18.3333H5.50008Z" fill="#9B9B9B"/>
            </svg>
            <p>Download</p>
          </a>
        `
          : `<p class="utils-accordion-date">Uploading...</p>`
      }
      </div>
    </div>
    `;
    })
    .join('');

  if (externalFiles.length === 0) {
    sentContentElement.innerHTML = `
        <p class="utils-accordion-hint-text">No files received yet.</p>
        `;
  }
};

export default updateReceivedFiles;
