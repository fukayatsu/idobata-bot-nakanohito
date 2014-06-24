$(document).on('click', 'a[href^="#bot_"]', function(){
  var botIdStr = $(this).attr('href');
  if ($(botIdStr).find('.ibn-message').length == 0) {
    $(botIdStr + ' dl').prepend('<dt>Test Message</dt><dd><input class="ibn-message" type="text" style="width: 75%;"><a class="btn pull-right ibn-message-send">Send</dd>')
  }
});

$(document).on('click', 'a.ibn-message-send', function(){
  var wrapper = $('a.ibn-message-send').parents('[id^="bot_"]')[0];
  var apiToken = $(wrapper).find('input[readonly]').val();
  var message  = $(wrapper).find('input.ibn-message').val();
  if (message.length == 0) {
    return;
  }

  var matches = $('.room a.active').attr('href').match(/organization\/([^\/]+)\/room\/([^\/]+)/)
  var params = {
    organization_slug: matches[1],
    room_name:         matches[2]
  }
  $.get("https://idobata.io/api/rooms", params, function(data) {
    var roomId = data.rooms[0].id
    var request = {
      params: {
        'message[room_id]': roomId,
        'message[source]':  message
      },
      apiToken: apiToken
    }
    $(wrapper).find('input.ibn-message').val("");
    chrome.runtime.sendMessage(request, function(response) {
    });
  });
});