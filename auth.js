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
});

function toggleForm() {
  const wrapper = document.getElementById('form-wrapper');
  wrapper.classList.toggle('signup-active');
}
