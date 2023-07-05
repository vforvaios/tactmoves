const notifications = (data) => {
  if (navigator) {
    navigator.serviceWorker.getRegistration().then((reg) => {
      reg.showNotification(data);
    });
  } else {
    alert('Navigator is not supported');
  }
};

export default notifications;
