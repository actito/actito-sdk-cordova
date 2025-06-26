document.addEventListener('deviceready', onDeviceReady, false);

async function onDeviceReady() {
  await checkLocationStatus();
}

async function checkLocationStatus() {
  try {
    const hasPermission = await ActitoGeo.checkPermissionStatus('location_when_in_use');
    const enabled = (await ActitoGeo.hasLocationServicesEnabled()) && hasPermission === 'granted';

    updateLocationCheckboxStatus(enabled);
  } catch (e) {
    console.log('=== Error checking location status ===');
    console.log(e);

    enqueueToast('Error checking location status.', 'error');
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function updateLocationStatus(checkbox) {
  if (!checkbox.checked) {
    try {
      await ActitoGeo.disableLocationUpdates();

      console.log('=== Disabled location updates successfully ===');
      enqueueToast('Disabled location updates successfully.', 'success');
    } catch (e) {
      console.log('=== Error disabling location updates ===');
      console.log(e);

      enqueueToast('Error disabling location updates.', 'error');
    }

    return;
  }

  try {
    if (await ensureForegroundLocationPermission()) {
      await ActitoGeo.enableLocationUpdates();

      console.log('=== Enabled foreground location updates successfully ===');
      enqueueToast('Enabled foreground location updates successfully.', 'success');
    } else {
      updateLocationCheckboxStatus(false);

      return;
    }
  } catch (e) {
    console.log('=== Error enabling foreground location updates ===');
    console.log(e);

    enqueueToast('Error enabling foreground location updates.', 'error');
  }

  try {
    if (await ensureBackgroundLocationPermission()) {
      await ensureBluetoothLocationPermisison();
      await ActitoGeo.enableLocationUpdates();

      console.log('=== Enabled background location updates successfully ===');
      enqueueToast('Enabled background location updates successfully.', 'success');
    }
  } catch (e) {
    console.log('=== Error enabling background location updates ===');
    console.log(e);

    enqueueToast('Error enabling background location updates.', 'error');
  }
}

async function ensureForegroundLocationPermission() {
  return new Promise(async function (resolve, reject) {
    try {
      const status = await ActitoGeo.checkPermissionStatus('location_when_in_use');

      if (status === 'granted') {
        resolve(true);

        return;
      }

      const requestStatus = await ActitoGeo.requestPermission('location_when_in_use');

      if (requestStatus === 'permanently_denied') {
        await ActitoPush.openAppSettings();
      }

      resolve(requestStatus === 'granted');
    } catch (e) {
      console.log('=== Error ensuring foreground location permission ===');
      console.log(e);

      enqueueToast('Error ensuring foreground location permission.', 'error');

      reject(error);
    }
  });
}

async function ensureBackgroundLocationPermission() {
  return new Promise(async function (resolve, reject) {
    try {
      const status = await ActitoGeo.checkPermissionStatus('location_always');

      if (status === 'granted') {
        resolve(true);

        return;
      }

      const requestStatus = await ActitoGeo.requestPermission('location_always');

      resolve(requestStatus === 'granted');
    } catch (e) {
      console.log('=== Error ensuring background location permission ===');
      console.log(e);

      enqueueToast('Error ensuring background location permission.', 'error');

      reject(error);
    }
  });
}

async function ensureBluetoothLocationPermisison() {
  return new Promise(async function (resolve, reject) {
    try {
      const status = await ActitoGeo.checkPermissionStatus('bluetooth_scan');

      if (status === 'granted') {
        resolve(true);

        return;
      }

      const requestStatus = await ActitoGeo.requestPermission('bluetooth_scan');
      resolve(requestStatus === 'granted');
    } catch (e) {
      console.log('=== Error ensuring bluetooth permission ===');
      console.log(e);

      enqueueToast('Error ensuring bluetooth permission.', 'error');

      reject(error);
    }
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function showLocationInfo() {
  const hasLocationServicesEnabled = await ActitoGeo.hasLocationServicesEnabled();
  const hasBluetoothEnabled = await ActitoGeo.hasBluetoothEnabled();

  navigator.notification.alert(
    `enabled: ${hasLocationServicesEnabled}
bluetooth: ${hasBluetoothEnabled}`, // message
    function () {
      // Callback function logic
    }, // callback
    '', // title
    'Ok' // buttonName
  );
}

function updateLocationCheckboxStatus(checked) {
  const checkbox = document.getElementById('locationCheckbox');
  checkbox.checked = checked;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function openBeacons() {
  window.location.replace('../beacons/beacons.html');
}
