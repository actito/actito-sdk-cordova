document.addEventListener('deviceready', onDeviceReady, false);

async function onDeviceReady() {
  setupLaunchFlowListeners();
  await checkIsReadyStatus();
}

function setupLaunchFlowListeners() {
  Actito.onReady(() => handleIsReadyStatus(true));

  Actito.onUnlaunched(() => handleIsReadyStatus(false));
}

async function checkIsReadyStatus() {
  try {
    const isReady = await Actito.isReady();
    handleIsReadyStatus(isReady);
  } catch (e) {
    console.log('=== Error getting isReady ===');
    console.log(e);

    enqueueToast('Error getting isReady.', 'error');
  }
}

function handleIsReadyStatus(isReady) {
  const launchButton = document.getElementById('launchButton');
  const unlaunchButton = document.getElementById('unlaunchButton');

  launchButton.disabled = isReady;
  unlaunchButton.disabled = !isReady;

  launchButton.style.opacity = isReady ? '0.5' : '1';
  unlaunchButton.style.opacity = !isReady ? '0.5' : '1';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function launchActito() {
  try {
    console.log('=== Launching Actito ===');
    await Actito.launch();

    console.log('=== Launching Actito Finished ===');
  } catch (e) {
    console.log('=== Error launching actito ===');
    console.log(e);

    enqueueToast('Error launching actito.', 'error');
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function unlaunchActito() {
  try {
    console.log('=== Unlaunching Actito ===');
    await Actito.unlaunch();

    console.log('=== Unlaunching Actito Finished ===');
  } catch (e) {
    console.log('=== Error unlaunching actito ===');
    console.log(e);

    enqueueToast('Error unlaunching actito.', 'error');
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function showLaunchFLowInfo() {
  const isReady = await Actito.isReady();
  const isConfigured = await Actito.isConfigured();

  navigator.notification.alert(
    `isReady: ${isReady}
isConfigured: ${isConfigured}`, // message
    function () {
      // Callback function logic
    }, // callback
    '', // title
    'Ok' // buttonName
  );
}
