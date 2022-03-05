// background.js
var fromyesterday = "Here will appear previous tasks";

chrome.storage.local.set({"fromyesterday": fromyesterday}, function() {});
chrome.storage.local.set({"fortoday": ""}, function() {});