var enabled;
chrome.storage.sync.get("pinyinifyEnabled", function(items){
  enabled = items["pinyinifyEnabled"];
  var button = document.getElementById("toggle-button");
  button.innerHTML= enabled ? "Enabled" : "Disabled";
  button.className = enabled ? "enabled" : "disabled";
});

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#toggle-button').addEventListener('click', toggleEnabled);
});

function toggleEnabled() {
  var button = document.getElementById("toggle-button");
  enabled = !enabled;
  chrome.tabs.query({}, function(tabs) {
    for (var i=0; i<tabs.length; i++) {
      if(enabled) {
        chrome.tabs.sendMessage(tabs[i].id, {action:'enable'}, function(response) {
          button.innerHTML= "Enabled";
          button.className = "enabled";
        });
      } else {
        chrome.tabs.sendMessage(tabs[i].id, {action:'disable'}, function(response) {
          button.innerHTML= "Disabled";
          button.className = "disabled";
        });
      }
    }
  });
}