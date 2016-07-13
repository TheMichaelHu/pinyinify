var enabled;
chrome.storage.sync.get("pinyinifyEnabled", function(items){
  enabled = items["pinyinifyEnabled"];
});

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('.toggle-button').addEventListener('click', toggleEnabled);
});

function toggleEnabled() {
  enabled = !enabled;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if(enabled) {
      chrome.tabs.sendMessage(tabs[0].id, {action:'enable'});
    } else {
      chrome.tabs.sendMessage(tabs[0].id, {action:'disable'});
    }
  });
}