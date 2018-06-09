var XML_DATA = null;

function GET_XML_DATA() {
      $.ajax({
            url: document.url,
            dataType: "xml",
            type: 'GET',
            
            success: function (data) {
                  if (data != "") {
                        XML_DATA = data;
                  }

                  console.log("OK");
            },
            error: function (xhr, status, error) {
                  console.log("Error");
            }
      });
}

$(document).ajaxComplete(function() {
      console.log(XML_DATA);
});