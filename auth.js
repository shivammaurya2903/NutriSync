document.addEventListener('DOMContentLoaded', function() {
  const googleBtn = document.getElementById('google-btn');
  const appleBtn = document.getElementById('apple-btn');

  if (googleBtn) {
    googleBtn.addEventListener('click', function() {
      alert('Google Sign-In is not implemented yet. Please use email and password.');
    });
  }

  if (appleBtn) {
    appleBtn.addEventListener('click', function() {
      alert('Apple Sign-In is not implemented yet. Please use email and password.');
    });
  }

  // Handle login form submission
  const loginForm = document.querySelector('.login-form form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value;
      const password = this.querySelector('input[type="password"]').value;
      loginUser(email, password);
    });
  }

  // Handle signup form submission
  const signupForm = document.querySelector('.signup-form form');
  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = this.querySelector('input[type="text"]').value;
      const email = this.querySelector('input[type="email"]').value;
      const password = this.querySelector('input[type="password"]').value;
      const confirmPassword = this.querySelectorAll('input[type="password"]')[1].value;
      registerUser(name, email, password, confirmPassword);
    });
  }

  // Check if user is logged in on page load
  checkSession();
});

function toggleForm() {
  const wrapper = document.getElementById('form-wrapper');
  wrapper.classList.toggle('signup-active');
}

async function registerUser(name, email, password, confirmPassword) {
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  try {
    const response = await fetch('register.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    });

    const result = await response.json();
    if (result.success) {
      alert(result.message);
      toggleForm(); // Switch to login form
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Registration failed. Please try again.');
  }
}

async function loginUser(email, password) {
  try {
    const response = await fetch('login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    });

    if (!response.ok) {
      console.error('Response status:', response.status, response.statusText);
      const text = await response.text();
      console.error('Response text:', text);
      alert(`Login failed: ${response.status} ${response.statusText}`);
      return;
    }

    const result = await response.json();
    if (result.success) {
      alert(result.message);
      window.location.href = 'index.html'; // Redirect to home page
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Login failed. Please try again.');
  }
}

function logoutUser() {
  localStorage.removeItem('nutrisync_session');
  window.location.href = 'login.html';
}

function checkSession() {
  const session = JSON.parse(localStorage.getItem('nutrisync_session'));
  const loginLink = document.getElementById('login-link');
  const logoutLink = document.getElementById('logout-link');
  const userNameSpan = document.getElementById('user-name');
  if (session && loginLink && logoutLink && userNameSpan) {
    loginLink.style.display = 'none';
    logoutLink.style.display = 'inline';
    userNameSpan.style.display = 'inline';
    userNameSpan.textContent = `Welcome, ${session.name}`;
    console.log('User logged in:', session.name);
  } else if (loginLink && logoutLink && userNameSpan) {
    loginLink.style.display = 'inline';
    logoutLink.style.display = 'none';
    userNameSpan.style.display = 'none';
  }
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem('nutrisync_session'));
}


