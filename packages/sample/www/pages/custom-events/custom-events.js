document.addEventListener('backbutton', handleBackButton, false);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function registerCustomEvent() {
  try {
    await Actito.events().logCustom('cordova-event');
    console.log('=== Registered custom event successfully ===');

    enqueueToast('Registered custom event successfully.', 'success');
  } catch (e) {
    console.log('=== Error registering custom event ===');
    console.log(e);

    enqueueToast('Error registering custom event.', 'error');
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function registerCustomEventWithData() {
  const data = {
    data_key: 'data_value',
  };

  try {
    await Actito.events().logCustom('cordova-event-data', data);
    console.log('=== Registered custom event with data successfully ===');

    enqueueToast('Registered custom event with data successfully', 'success');
  } catch (e) {
    console.log('=== Error registering custom event with data ===');
    console.log(e);

    enqueueToast('Error registering custom event with data.', 'error');
  }
}

function handleBackButton() {
  window.location.replace('../home/home.html');
}
