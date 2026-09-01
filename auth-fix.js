(function () {
  function safeJsonParse(value, fallback) {
    try { return JSON.parse(value || 'null') || fallback; }
    catch { return fallback; }
  }

  function ensureDemoUser() {
    const users = safeJsonParse(localStorage.getItem('kwhyzor_demo_users'), {});
    const email = 'demo@kwhyzor.ai';
    const defaultUser = {
      id: 'demo-default-user',
      email,
      name: 'Demo User',
      displayName: 'Demo User',
      password: 'demo123',
      plan: 'Free',
      role: 'user',
      memberSince: new Date().toISOString()
    };
    if (!users[email]) {
      users[email] = defaultUser;
      localStorage.setItem('kwhyzor_demo_users', JSON.stringify(users));
    }
    return users[email];
  }

  function setDemoSession(user) {
    localStorage.setItem('kwhyzor_demo_session', JSON.stringify({ id: user.id, email: user.email }));
    localStorage.setItem('kwhyzor_name', user.name);
    localStorage.setItem('kwhyzor_display_name', user.displayName || user.name);
    localStorage.setItem('kwhyzor_role', user.role || 'user');
    localStorage.setItem('kwhyzor_member_since', user.memberSince || new Date().toISOString());
  }

  function enterApp() {
    const authScreen = document.getElementById('authScreen');
    const appScreen = document.getElementById('appScreen');
    if (authScreen) authScreen.classList.add('hidden');
    if (appScreen) appScreen.classList.remove('hidden');
    const title = document.getElementById('pageTitle');
    if (title) title.textContent = 'Dashboard';
  }

  function signInDemo() {
    const user = ensureDemoUser();
    setDemoSession(user);
    const userName = document.getElementById('userName');
    if (userName) userName.textContent = user.displayName || user.name;
    enterApp();
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = 'Demo access granted.';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2400);
    }
  }

  function bindAuthForms() {
    const signinForm = document.getElementById('signinForm');
    const signupForm = document.getElementById('signupForm');

    if (signinForm) {
      signinForm.addEventListener('submit', function (event) {
        event.preventDefault();
        signInDemo();
      });
    }

    if (signupForm) {
      signupForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const nameInput = document.getElementById('signupName');
        const emailInput = document.getElementById('signupEmail');
        const passwordInput = document.getElementById('signupPassword');
        const name = (nameInput && nameInput.value) ? nameInput.value.trim() : 'Demo User';
        const email = (emailInput && emailInput.value) ? emailInput.value.trim() : 'demo@kwhyzor.ai';
        const password = (passwordInput && passwordInput.value) ? passwordInput.value : 'demo123';
        const users = safeJsonParse(localStorage.getItem('kwhyzor_demo_users'), {});
        const user = { id: `demo-${Date.now()}`, email, name, displayName: name, password, plan: 'Free', role: 'user', memberSince: new Date().toISOString() };
        users[email.toLowerCase()] = user;
        localStorage.setItem('kwhyzor_demo_users', JSON.stringify(users));
        setDemoSession(user);
        enterApp();
      });
    }

    document.querySelectorAll('.demo-access').forEach(function (button) {
      button.addEventListener('click', function () {
        signInDemo();
      });
    });
  }

  function initialize() {
    ensureDemoUser();
    bindAuthForms();
    const demoSession = safeJsonParse(localStorage.getItem('kwhyzor_demo_session'), null);
    if (demoSession) {
      enterApp();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
}());
