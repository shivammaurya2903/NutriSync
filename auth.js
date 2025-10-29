document.addEventListener('DOMContentLoaded', function() {
  const googleBtn = document.getElementById('google-btn');
  const appleBtn = document.getElementById('apple-btn');

  if (googleBtn) {
    googleBtn.addEventListener('click', function() {
      alert('This feature is not implemented yet.');
    });
  }

  if (appleBtn) {
    appleBtn.addEventListener('click', function() {
      alert('This feature is not implemented yet.');
    });
  }
});

function toggleForm() {
  const wrapper = document.getElementById('form-wrapper');
  wrapper.classList.toggle('signup-active');
}
