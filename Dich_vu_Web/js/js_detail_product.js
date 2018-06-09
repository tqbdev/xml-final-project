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

$(document).ajaxComplete(function () {
      //console.log(XML_DATA);
      var book = XML_DATA.getElementsByTagName("Sach")[0];
      var SKU = book.getAttribute("SKU");
      $("#product_img_div").empty();

      var img = `<img id="product_image" class="product_img" src="resources/${SKU}.jpg" alt="" data-zoom-image="resources/${SKU}.jpg">`
      $("#product_img_div").append(img);

      $("#product_image").ezPlus();
});