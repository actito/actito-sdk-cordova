document.addEventListener('deviceready', onDeviceReady, false);

async function onDeviceReady() {
  setupRemoteNotificationsListeners();
  await checkNotificationsStatus();
  await getInboxBadge();
}

function setupRemoteNotificationsListeners() {
  ActitoInbox.onBadgeUpdated(setInboxBadgeElement);

  ActitoPush.onNotificationSettingsChanged(() => checkNotificationsStatus());
}

async function checkNotificationsStatus() {
  try {
    const enabled = (await ActitoPush.hasRemoteNotificationsEnabled()) && (await ActitoPush.allowedUI());

    updateNotificationsCheckboxStatus(enabled);
  } catch (e) {
    console.log('=== Error checking remote notifications status ===');
    console.log(e);

    enqueueToast('Error checking remote notifications status.', 'error');
  }
}

async function getInboxBadge() {
  try {
    const badge = await ActitoInbox.getBadge();
    setInboxBadgeElement(badge);
  } catch (e) {
    console.log('=== Error getting inbox badge ===');
    console.log(e);

    enqueueToast('Error getting inbox badge.', 'error');
  }
}

async function setInboxBadgeElement(badge) {
  const inboxBadge = document.getElementById('inboxBadge');

  if (badge > 0) {
    inboxBadge.innerText = badge;
    inboxBadge.style.display = 'block';

    return;
  }

  inboxBadge.style.display = 'none';
  inboxBadge.innerText = '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function updateNotificationsStatus(checkbox) {
  if (!checkbox.checked) {
    try {
      console.log('=== Disabling Remote Notifications ===');
      await ActitoPush.disableRemoteNotifications();

      console.log('=== Disabling Remote Notifications Finished ===');
      enqueueToast('Disabled remote notifications successfully.', 'success');
    } catch (e) {
      console.log('=== Error disabling remote notifications ===');
      console.log(e);

      enqueueToast('Error disabling remote notifications.', 'error');
    }

    return;
  }

  try {
    if (await ensureNotificationsPermission()) {
      console.log('=== Enabling Remote Notifications ===');
      await ActitoPush.enableRemoteNotifications();

      console.log('=== Enabling Remote Notifications Finished ===');
      enqueueToast('Enabled remote notifications successfully.', 'success');

      return;
    }
  } catch (e) {
    console.log('=== Error enabling remote notifications ===');
    console.log(e);

    enqueueToast('Error enabling remote notifications.', 'error');
  }

  updateNotificationsCheckboxStatus(false);
}

function ensureNotificationsPermission() {
  return new Promise(async function (resolve, reject) {
    try {
      const status = await ActitoPush.checkPermissionStatus();

      if (status === 'granted') {
        resolve(true);

        return;
      }

      const requestStatus = await ActitoPush.requestPermission();

      if (requestStatus === 'permanently_denied') {
        await ActitoPush.openAppSettings();
      }

      resolve(requestStatus === 'granted');
    } catch (e) {
      console.log('=== Error ensuring notifications permission ===');
      console.log(e);

      enqueueToast('Error ensuring notifications permission.', 'error');

      reject(error);
    }
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function showNotificationsInfo() {
  const allowedUi = await ActitoPush.allowedUI();
  const hasRemoteNotificationsEnabled = await ActitoPush.hasRemoteNotificationsEnabled();
  const transport = await ActitoPush.getTransport();
  const subscription = await ActitoPush.getSubscription();

  navigator.notification.alert(
    `allowedUi: ${allowedUi}
enabled: ${hasRemoteNotificationsEnabled}
transport: ${transport}
token: ${subscription?.token}`, // message
    function () {
      // Callback function logic
    }, // callback
    '', // title
    'Ok' // buttonName
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function updateNotificationsCheckboxStatus(checked) {
  const checkbox = document.getElementById('notificationsCheckbox');
  checkbox.checked = checked;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function openInbox() {
  window.location.replace('../inbox/inbox.html');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function openTags() {
  window.location.replace('../tags/tags-view.html');
}
