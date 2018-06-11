$(document).ready(function () {
      $.ajax({
            headers: {
                  'token': window.localStorage.getItem('Token-key')
            },
            url: document.url,
            dataType: "html",
            type: 'POST',

            success: function (data, textStatus, jqXHR) {
                  document.open("text/html", "replace");
                  document.write(data);
                  document.close();
            },
            error: function (xhr, status, error) {
                  alert("Load error.\r\n" + error.message);
                  window.localStorage.remove('Token-key');
            }
      });
});