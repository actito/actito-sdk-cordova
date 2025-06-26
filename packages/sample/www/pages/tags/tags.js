document.addEventListener('deviceready', onDeviceReady, false);
document.addEventListener('backbutton', handleBackButton, false);

async function onDeviceReady() {
  await fetchTags();
}

async function fetchTags() {
  const deviceTagsContainer = document.getElementById('deviceTags');
  deviceTagsContainer.innerHTML = '';

  try {
    const result = await Actito.device().fetchTags();

    console.log('=== Tags fetched successfully ===');
    enqueueToast('Tags fetched successfully.', 'success');

    if (result.length > 0) {
      const lastIndex = result.length - 1;
      let index = 0;

      for (const tag of result) {
        const tagView = `
              <div class="data-row">
                <span class="data-label">${tag}</span>
              </div>
            `;

        deviceTagsContainer.innerHTML += tagView;

        if (index !== lastIndex) {
          const divider = '<div class="divider-horizontal"></div>';
          deviceTagsContainer.innerHTML += divider;
        }

        index++;
      }
    } else {
      deviceTagsContainer.innerHTML = `
      <div class="data-row">
        <span class="data-label">No Data</span>
      </div>
    `;
    }
  } catch (e) {
    console.log('=== Error fetching tags ===');
    console.log(e);

    enqueueToast('Error fetching tags.', 'error');
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function addTags() {
  try {
    await Actito.device().addTags(['react-native', 'hpinhal', 'remove-me']);

    console.log('=== Tags added successfully ===');
    enqueueToast('Tags added successfully.', 'success');

    await fetchTags();
  } catch (e) {
    console.log('=== Error adding tags ===');
    console.log(e);

    enqueueToast('Error adding tags.', 'error');
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function removeTag() {
  try {
    await Actito.device().removeTag('remove-me');

    console.log('=== Tag removed successfully ===');
    enqueueToast('Tag removed successfully.', 'success');

    await fetchTags();
  } catch (e) {
    console.log('=== Error removing tags ===');
    console.log(e);

    enqueueToast('Error removing tags.', 'error');
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function clearTags() {
  try {
    await Actito.device().clearTags();

    console.log('=== Tags cleared successfully ===');
    enqueueToast('Tags cleared successfully.', 'success');

    await fetchTags();
  } catch (e) {
    console.log('=== Error clearing tags ===');
    console.log(e);

    enqueueToast('Error clearing tags.', 'error');
  }
}

function handleBackButton() {
  window.location.replace('../home/home.html');
}
