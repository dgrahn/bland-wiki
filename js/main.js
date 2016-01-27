
// The API
var API_URL = "https://en.wikipedia.org/w/api.php?explaintext&titles=";

var DATA = {
  'action'      : 'query',
  'format'      : 'json',
  'prop'        : 'extracts',
  'exchars'     : 999999999,
  'explaintext' : true,
  'titles'      : 'The Daily Show'
};

function success(data, textStatus, jqXHR) {

  var pages = data['query']['pages'];
  var id;

  for (key in pages) {
    id = key;
    break;
  }

  var content = "<p>" + pages[id]['extract'] + "</p>";

  content = content.replace(/=+\s*([^=]*)\s*=+/g, function(match, g1) {
    return "</p><p>" + g1.replace(/Edit\s*$/, '') + "</p><p>";
  })

  $("#article").html(content);
  download();
}

var downloadLink = null;

function download() {

  // Make the download link
  var content = $("#article").html();
  content = content.replace(/<p>/g, "\r\n");
  content = content.replace(/<\/p>/g, "");

  var blob = new Blob([content], { type: 'text/plain' });

  console.log("blob = " + content);

  var url = window.URL || window.webkitURL;

  if (downloadLink != null) {
    url.revokeObjectURL(downloadLink);
  }

  var downloadLink = url.createObjectURL(blob);

  $("#download").attr('href', downloadLink);
  $("#download").attr('download', $('input[name=title]').val() + '.txt');
  $("#download").removeClass('hide');
}


$(document).ready(function() {

  $("form").submit(function() {

    DATA['titles'] = $("input[name=title]").val();

    $.ajax({
      dataType: "jsonp",
      url: API_URL,
      data: DATA,
      success: success
    });

    return false;

  });

  $("input[name=download]").click(download);

});
