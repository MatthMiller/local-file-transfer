const generateQRModal = (text) => {
  const generateQRButton = document.getElementById('js-generate-qr-button');
  const qrModal = document.getElementById('js-qr-modal');

  new QRCode('js-qr-code', text);

  generateQRButton.addEventListener('click', () => {
    qrModal.classList.add('active');
  });

  qrModal.addEventListener('click', ({ target }) => {
    if (target.id === 'js-qr-modal' || target.id === 'js-close-qr-modal') {
      qrModal.classList.remove('active');
    }
  });
};

export default generateQRModal;
