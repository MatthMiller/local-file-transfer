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
      <div class="utils-accordion-item-right-info">
      ${
        fileLink
          ? `<p class="utils-accordion-date">Informações</p>
        <p class="utils-accordion-time">Download (mudar isso pro botão com link)</p>`
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
