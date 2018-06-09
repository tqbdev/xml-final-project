function GET_XML_INDEX_PAGE() {
      // let xmlDoc = null;

      // let xhr = new XMLHttpRequest();
      // xhr.open("GET", , false);
      // xhr.send("");
      // let XML_String = xhr.responseText.trim();

      // let parser = new DOMParser();
      // if (XML_String != "") {
      //       xmlDoc = parser.parseFromString(XML_String, "text/xml");
      // }

      // return xmlDoc;

      var xmlDoc = null;
      let parser = new DOMParser();

      $.ajax({
            url: document.url,
            dataType: "xml",
            type: 'GET',
            success: function (data) {
                  if (data != "") {
                        xmlDoc = parser.parseFromString(XML_String, "text/xml");
                  }
            },
            error: function (xhr, status, error) {

            }
      });

      console.log(xmlDoc);
      return xmlDoc;
}