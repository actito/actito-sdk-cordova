// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function updateSuppressMessagesStatus(checkbox) {
  const evaluateContextCheckbox = document.getElementById('evaluateContextCheckbox');

  const shouldEvaluateContext = evaluateContextCheckbox.checked;
  const suppressed = checkbox.checked;

  try {
    await ActitoInAppMessaging.setMessagesSuppressed(suppressed, shouldEvaluateContext);

    console.log('=== IAM Suppress status updates successfully ===');
    enqueueToast('IAM Suppress status updates successfully.', 'success');
  } catch (e) {
    console.log('=== Error updating IAM suppress status ===');
    console.log(e);

    enqueueToast('Error updating IAM suppress status.', 'error');
  }
}
