chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ email: null });
    chrome.storage.local.get("email", (result) => {
        if (!result.email) {
          chrome.windows.create({
            url: 'emailPrompt.html',
            type: 'popup',
            width: 400,
            height: 200
          });
        } else {
          chrome.action.openPopup();
        }
      });
  });