const updateSentFiles = (filesArray, desktopId) => {
  const sentContentElement = document.querySelector(
    '#js-accordion-sent-files-content'
  );
  const sentFilesCounter = document.querySelector('#js-sent-files-counter');

  const filesFromDesktop = filesArray.filter((file) => {
    return file.deviceUUID === desktopId;
  });

  // funfando
  console.log(filesFromDesktop);
  sentFilesCounter.innerText = `(${filesFromDesktop.length})`;

  sentContentElement.innerHTML = filesFromDesktop
    .map(({ originalName, fileSize, uuid, createdAt }) => {
      return `
    <div data-id="${uuid}" class="utils-accordion-item">
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
          <p class="utils-accordion-item-status">SIZE: <span>${fileSize} bytes</span></p>
        </div>
      </div>
      <div class="utils-accordion-item-right-info">
      ${
        createdAt
          ? `<p class="utils-accordion-date">${createdAt.date}</p>
        <p class="utils-accordion-time">${createdAt.time}</p>`
          : `<p class="utils-accordion-date">Uploading...</p>`
      }
      </div>
    </div>
    `;
    })
    .join('');

  if (filesFromDesktop.length === 0) {
    sentContentElement.innerHTML = `
        <p class="utils-accordion-hint-text">No files sent yet.</p>
        `;
  }
};

export default updateSentFiles;
