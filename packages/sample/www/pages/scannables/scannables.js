// document.addEventListener('deviceready', onDeviceReady, false);
// document.addEventListener('backbutton', handleBackButton, false);
//
// async function onDeviceReady() {
//   await checkNfcAvailable();
// }
//
// async function checkNfcAvailable() {
//   try {
//     const available = await ActitoScannables.canStartNfcScannableSession();
//
//     const nfcButton = document.getElementById('nfcButton');
//     nfcButton.disabled = !available;
//     nfcButton.style.opacity = available ? '1' : '0.5';
//   } catch (e) {
//     console.log('=== Error checking NFC availability ===');
//     console.log(e);
//
//     enqueueToast('Error checking NFC availability.', 'error');
//   }
// }
//
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// async function startQrCodeScannableSession() {
//   try {
//     await ActitoScannables.startQrCodeScannableSession();
//   } catch (e) {
//     console.log('=== Error starting QR Code scannable session ===');
//     console.log(e);
//
//     enqueueToast('Error starting QR Code scannable session.', 'error');
//   }
// }
//
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// async function startNfcScannableSession() {
//   try {
//     await ActitoScannables.startNfcScannableSession();
//   } catch (e) {
//     console.log('=== Error starting NFC scannable session ===');
//     console.log(e);
//
//     enqueueToast('Error starting NFC scannable session.', 'error');
//   }
// }
//
// function handleBackButton() {
//   window.location.replace('../home/home.html');
// }
