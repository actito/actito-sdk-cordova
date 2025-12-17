document.addEventListener('deviceready', onDeviceReady, false);

async function onDeviceReady() {
  setupHomeListeners();

  try {
    if (await Actito.isReady()) {
      onActitoReady();

      return;
    }
  } catch (e) {
    console.log(e);
    enqueueToast('Error checking isReady.', 'error');
  }

  await launch();
}

function setupHomeListeners() {
  Actito.onReady(async () => {
    onActitoReady();
    await handleDeferredLink();
  });

  Actito.onUnlaunched(() => onActitoUnlaunched());
}

function onActitoReady() {
  const homeContainer = document.getElementById('homeContainer');

  const homeContainerContent = `
            <div w3-include-html="views/current-device-card/current-device-card-view.html"></div>
            <div w3-include-html="views/remote-notifications-card/remote-notifications-card-view.html"></div>
            <div w3-include-html="views/dnd-card/dnd-card-view.html"></div>
            <div w3-include-html="views/geo-card/geo-card-view.html"></div>
            <div w3-include-html="views/iam-card/iam-card-view.html"></div>
            <div w3-include-html="views/other-features/other-features-view.html"></div>
  `;

  homeContainer.innerHTML = homeContainerContent;

  addHTML();
}

function onActitoUnlaunched() {
  const homeContainer = document.getElementById('homeContainer');
  homeContainer.innerHTML = '';
}

async function launch() {
  console.log(`---> Launching Actito <---`);

  try {
    await ActitoPush.setPresentationOptions(['banner', 'badge', 'sound']);
    await Actito.launch();
  } catch (e) {
    console.log('=== Error launching actito ===');
    console.log(e);

    enqueueToast('Error launching actito.', 'error');
  }
}

async function handleDeferredLink() {
  try {
    if (!(await Actito.canEvaluateDeferredLink())) {
      return;
    }

    const evaluate = await Actito.evaluateDeferredLink();
    console.log(`Did evaluate deferred link: ${evaluate}`);
  } catch (e) {
    console.log('=== Error evaluating deferred link ===');
    console.log(JSON.stringify(e));
  }
}
