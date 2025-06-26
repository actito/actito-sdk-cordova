document.addEventListener('deviceready', setupListeners, false);

function setupListeners() {
  console.log(`---> Setup Actito Listeners <---`);

  Actito.onReady((application) => {
    console.log('=======================');
    console.log('= ACTITO IS READY =');
    console.log('=======================');
    console.log(JSON.stringify(application));
  });

  Actito.onUnlaunched((application) => {
    console.log('=======================');
    console.log('= ACTITO UNLAUNCHED =');
    console.log('=======================');
    console.log(JSON.stringify(application));
  });

  Actito.onUrlOpened((url) => {
    console.log(`---> On URL opened = ${url}`);
  });

  Actito.onDeviceRegistered((device) => {
    console.log(`---> Device registered: ${JSON.stringify(device)}`);
  });

  // ActitoPush.onNotificationInfoReceived(({ notification, deliveryMechanism }) => {
  //   console.log(`---> Received notification = ${JSON.stringify(notification)}`);
  //   console.log(`---> Delivery mechanism = ${deliveryMechanism}`);
  // });
  //
  // ActitoPush.onUnknownNotificationReceived((notification) => {
  //   console.log(`---> Unknown notification received = ${JSON.stringify(notification)}`);
  // });
  //
  // ActitoPush.onNotificationOpened(async (notification) => {
  //   console.log(`---> Opened notification = ${JSON.stringify(notification)}`);
  //
  //   await ActitoPushUI.presentNotification(notification);
  // });
  //
  // ActitoPush.onUnknownNotificationOpened((notification) => {
  //   console.log(`---> Opened unknown notification = ${JSON.stringify(notification)}`);
  // });
  //
  // ActitoPush.onNotificationSettingsChanged((granted) => {
  //   console.log('=== NOTIFICATION SETTINGS CHANGED ===');
  //   console.log(JSON.stringify(granted, null, 2));
  // });
  //
  // ActitoPush.onSubscriptionChanged((subscription) => {
  //   console.log('=== SUBSCRIPTION CHANGED ===');
  //   console.log(JSON.stringify(subscription, null, 2));
  // });
  //
  // ActitoInbox.onBadgeUpdated((badge) => {
  //   console.log(`---> Badge updated = ${badge}`);
  // });
  //
  // ActitoInbox.onInboxUpdated((items) => {
  //   console.log(`---> Inbox updated = ${JSON.stringify(items)}`);
  // });
  //
  // ActitoPushUI.onNotificationWillPresent((notification) => {
  //   console.log('=== NOTIFICATION WILL PRESENT ===');
  //   console.log(JSON.stringify(notification));
  // });
  //
  // ActitoPushUI.onNotificationPresented((notification) => {
  //   console.log('=== NOTIFICATION PRESENTED ===');
  //   console.log(JSON.stringify(notification));
  // });
  //
  // ActitoPushUI.onNotificationFinishedPresenting((notification) => {
  //   console.log('=== NOTIFICATION FINISHED PRESENTING ===');
  //   console.log(JSON.stringify(notification));
  // });
  //
  // ActitoPushUI.onNotificationFailedToPresent((notification) => {
  //   console.log('=== NOTIFICATION FAILED TO PRESENT ===');
  //   console.log(JSON.stringify(notification));
  // });
  //
  // ActitoPushUI.onNotificationUrlClicked((data) => {
  //   console.log('=== NOTIFICATION URL CLICKED ===');
  //   console.log(JSON.stringify(data));
  // });
  //
  // ActitoPushUI.onActionWillExecute((data) => {
  //   console.log('=== ACTION WILL EXECUTE ===');
  //   console.log(JSON.stringify(data));
  // });
  //
  // ActitoPushUI.onActionExecuted((data) => {
  //   console.log('=== ACTION EXECUTED ===');
  //   console.log(JSON.stringify(data));
  // });
  //
  // ActitoPushUI.onActionNotExecuted((data) => {
  //   console.log('=== ACTION NOT EXECUTED ===');
  //   console.log(JSON.stringify(data));
  // });
  //
  // ActitoPushUI.onActionFailedToExecute((data) => {
  //   console.log('=== ACTION FAILED TO EXECUTE ===');
  //   console.log(JSON.stringify(data));
  // });
  //
  // ActitoPushUI.onCustomActionReceived((data) => {
  //   console.log('=== CUSTOM ACTION RECEIVED ===');
  //   console.log(JSON.stringify(data));
  // });

  ActitoGeo.onLocationUpdated((location) => {
    console.log('=== LOCATION UPDATED ===');
    console.log(JSON.stringify(location, null, 2));
  });

  ActitoGeo.onRegionEntered((region) => {
    console.log('=== REGION ENTERED ===');
    console.log(JSON.stringify(region, null, 2));
  });

  ActitoGeo.onRegionExited((region) => {
    console.log('=== REGION EXITED ===');
    console.log(JSON.stringify(region, null, 2));
  });

  ActitoGeo.onBeaconEntered((beacon) => {
    console.log('=== BEACON ENTERED ===');
    console.log(JSON.stringify(beacon, null, 2));
  });

  ActitoGeo.onBeaconExited((beacon) => {
    console.log('=== BEACON EXITED ===');
    console.log(JSON.stringify(beacon, null, 2));
  });

  ActitoGeo.onBeaconsRanged(({ region, beacons }) => {
    console.log('=== BEACONS RANGED ===');
    console.log(JSON.stringify({ region, beacons }, null, 2));
  });

  ActitoGeo.onVisit((visit) => {
    console.log('=== VISIT ===');
    console.log(JSON.stringify(visit, null, 2));
  });

  ActitoGeo.onHeadingUpdated((heading) => {
    console.log('=== HEADING UPDATED ===');
    console.log(JSON.stringify(heading, null, 2));
  });
  //
  // ActitoScannables.onScannableDetected(async (scannable) => {
  //   console.log('=== SCANNABLE DETECTED ===');
  //   console.log(JSON.stringify(scannable, null, 2));
  //
  //   if (scannable.notification != null) {
  //     await ActitoPushUI.presentNotification(scannable.notification);
  //   }
  // });
  //
  // ActitoScannables.onScannableSessionFailed((error) => {
  //   console.log('=== SCANNABLE SESSION FAILED ===');
  //   console.log(JSON.stringify(error, null, 2));
  // });
  //
  // ActitoInAppMessaging.onMessagePresented((message) => {
  //   console.log('=== MESSAGE PRESENTED ===');
  //   console.log(JSON.stringify(message, null, 2));
  // });
  //
  // ActitoInAppMessaging.onMessageFinishedPresenting((message) => {
  //   console.log('=== MESSAGE FINISHED PRESENTING ===');
  //   console.log(JSON.stringify(message, null, 2));
  // });
  //
  // ActitoInAppMessaging.onMessageFailedToPresent((message) => {
  //   console.log('=== MESSAGE FAILED TO PRESENT ===');
  //   console.log(JSON.stringify(message, null, 2));
  // });
  //
  // ActitoInAppMessaging.onActionExecuted(({ message, action }) => {
  //   console.log('=== ACTION EXECUTED ===');
  //   console.log(JSON.stringify({ message, action }, null, 2));
  // });
  //
  // ActitoInAppMessaging.onActionFailedToExecute(({ message, action, error }) => {
  //   console.log('=== ACTION FAILED TO EXECUTE ===');
  //   console.log(JSON.stringify({ message, action, error }, null, 2));
  // });

  console.log(`---> Actito Listeners are ready <---`);
}
