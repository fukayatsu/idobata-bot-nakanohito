chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  $.ajax({
    type: "POST",
    url:  "https://idobata.io/api/messages",
    data: request.params,
    headers: {
      'X-API-Token': request.apiToken,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    success: function(msg) {
      sendResponse(msg);
    },
    error: function(msg) {
      console.log(msg);
    }
  });
});

chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
  var isBotRequest = false;
  for (var i = 0; i < details.requestHeaders.length; ++i) {
    if (details.requestHeaders[i].name === 'X-API-Token') {
      isBotRequest = true;
      break;
    }
  }
  if (isBotRequest) {
    for (var i = 0; i < details.requestHeaders.length; ++i) {
      if (details.requestHeaders[i].name === 'Cookie') {
        details.requestHeaders.splice(i, 1);
        break;
      }
    }
  }
  return { requestHeaders: details.requestHeaders };
}, {
  urls: ["https://idobata.io/api/messages"],
  types:[
    "xmlhttprequest"
  ]
},
  ["blocking", "requestHeaders"]
);

chrome.webRequest.onHeadersReceived.addListener(function(details) {
  for (var i = 0; i < details.responseHeaders.length; ++i) {
    if (details.responseHeaders[i].name === 'Set-Cookie') {
      details.responseHeaders.splice(i, 1);
      break;
    }
  }
  return { responseHeaders: details.responseHeaders };
}, {
  urls: ["https://idobata.io/api/messages"],
  types:[
    "xmlhttprequest"
  ]
},
  ["blocking", "responseHeaders"]
);