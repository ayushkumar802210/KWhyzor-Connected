(function () {
  function initialize() {
    const authScreen = document.getElementById('authScreen');
    const appScreen = document.getElementById('appScreen');
    if (authScreen) authScreen.classList.remove('hidden');
    if (appScreen) appScreen.classList.add('hidden');
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = 'No electricity data exists until the user uploads or enters real information.';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2400);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
}());
