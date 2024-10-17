document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.getElementById('submitEmail');
    if (submitButton) {
      submitButton.addEventListener('click', function() {
        const email = document.getElementById('emailInput').value;
        if (email) {
          chrome.storage.local.set({ email: email }, function() {
            window.close();
          });
        }
      });
    }
  });