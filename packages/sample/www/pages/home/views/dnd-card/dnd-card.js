document.addEventListener('deviceready', onDeviceReady, false);

async function onDeviceReady() {
  await checkDndStatus();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function checkDndStatus() {
  try {
    const dnd = await Actito.device().fetchDoNotDisturb();

    console.log('=== DnD fetched successfully ===');
    enqueueToast('DnD fetched successfully.', 'success');

    const checkbox = document.getElementById('dndCheckbox');
    checkbox.checked = dnd != null;
  } catch (e) {
    console.log('=== Error fetching DnD ===');
    console.log(e);

    enqueueToast('Error fetching DnD.', 'error');
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function updateDndStatus(checkbox) {
  if (!checkbox.checked) {
    try {
      await Actito.device().clearDoNotDisturb();

      console.log('=== DnD cleared successfully ===');
      enqueueToast('DnD cleared successfully.', 'success');
    } catch (e) {
      console.log('=== Error cleaning DnD ===');
      console.log(e);

      enqueueToast('Error cleaning DnD.', 'error');
    }

    return;
  }

  try {
    await Actito.device().updateDoNotDisturb({ start: '23:00', end: '08:00' });

    console.log('=== DnD updated successfully ===');
    enqueueToast('DnD updated successfully.', 'success');
  } catch (e) {
    console.log('=== Failed to update DnD ===');
    console.log(e);

    enqueueToast('Failed to update DnD.', 'error');
  }
}
