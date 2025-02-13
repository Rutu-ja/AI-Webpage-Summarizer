document.addEventListener("DOMContentLoaded", () => {
  let pageUrl = window.location.href;
  chrome.runtime.sendMessage({ action: "saveContent", data: pageUrl });
});
