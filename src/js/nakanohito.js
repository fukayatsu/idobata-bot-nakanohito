$(document).on('click', 'a[href*="/settings/bots/"]', function(){
  if ($('#nakanohito_text').length) { return ; }
  $('.panel-body.form-horizontal').prepend('<div class="form-group"><label class="control-label col-sm-3">Test Message</label><div class="col-sm-9 horizontal-container spaced"><input id="nakanohito_text" class="ember-view ember-text-field copy-field form-control fit" type="text"><button id="nakanohito_send" class="ember-view btn btn-default btn-sm tooltipstered" style="">Send</button></div></div>')
});

$(document).on('keypress', '#nakanohito_text', function(e){
  if (e.keyCode == 13) { $('#nakanohito_send').trigger('click'); }
});

$(document).on('click', '#nakanohito_send', function(){
  var message = $('#nakanohito_text').val();
  if (message.length == 0) { return; }

  var apiToken = $('input.copy-field[readonly]').val()
  var matches = location.href.match(/organization\/([^\/]+)\/room\/([^\/]+)/)
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
    $('#nakanohito_text').val("");
    chrome.runtime.sendMessage(request, function(response) {
    });
  });
});
