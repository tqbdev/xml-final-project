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
      var list_book = XML_DATA.getElementsByTagName("Sach");
      $("#list_product").empty();

      if (document.URL.includes("search?q=")) {
            var length = list_book.length;
            var span = `<p style="font-size: 20px; margin: 20px;">Kết quả tìm kiếm: ${length} sản phẩm.</p>`;
            $(span).insertBefore("#list_product");
      }

      for (let i = 0; i < list_book.length; i++) {
            if (list_book[i].nodeType != 1) {
                  continue;
            }

            var book = list_book[i];
            var name = book.getAttribute("Ten");
            var price = book.getAttribute("Gia_ban");
            var SKU = book.getAttribute("SKU");

            var link_product = document.location.origin + `/detail_product?p=${SKU}`;

            var product_html = `
            <div class="col-md-3 product-item">
            <a href="${link_product}">
                  <span>
                        <img class="img-fluid" src="resources/${SKU}.jpg" />
                  </span>
                  <span class="product-item-title">${name}</span>
                  <h4 class="product-item-price">${Convert_Price_String(price)} đ</h4>
            </a>
            </div>`

            $("#list_product").append(product_html);
      }
});