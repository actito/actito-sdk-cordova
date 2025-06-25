var toastQueue = [];

function showToast(message, type) {
  var toast = document.getElementById('toast');
  toast.innerText = message;

  if (type === 'error') {
    toast.style.backgroundColor = '#ff0000';
  } else if (type === 'success') {
    toast.style.backgroundColor = '#048404';
  } else {
    toast.style.backgroundColor = '#333';
  }

  toast.style.display = 'block';
  setTimeout(function () {
    toast.style.display = 'none';
    processToastQueue();
  }, 1000);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function enqueueToast(message, type) {
  toastQueue.push({ message: message, type: type });
  if (toastQueue.length === 1) {
    showToast(message, type);
  }
}

function processToastQueue() {
  toastQueue.shift();

  if (toastQueue.length > 0) {
    setTimeout(function () {
      showToast(toastQueue[0].message, toastQueue[0].type);
    }, 500);
  }
}
