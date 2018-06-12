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
      var list_top_new = XML_DATA.getElementsByTagName("Danh_sach_Top_New")[0];
      
      var book_top_new = list_top_new.getElementsByTagName("Sach");
      $("#carouselTopTenNew .carousel-item").each(function (index) {
            var book = book_top_new[index];
            var SKU = book.getAttribute("SKU");
            var link_product = document.location.origin + `/detail_product?p=${SKU}`;
            var img = `<a href="${link_product}"><img class="img-fluid mx-auto d-block" src="resources/${SKU}.jpg" alt="${SKU}"></a>`
            $(this).empty();
            $(this).append(img);
      });

      var list_top_revenue = XML_DATA.getElementsByTagName("Danh_sach_Top_Revenue")[0];
      
      var book_top_revenue = list_top_revenue.getElementsByTagName("Sach");
      $("#carouselTopTenSale .carousel-item").each(function (index) {
            var book = book_top_revenue[index];
            var SKU = book.getAttribute("SKU");
            var link_product = document.location.origin + `/detail_product?p=${SKU}`;
            var img = `<a href="${link_product}"><img class="img-fluid mx-auto d-block" src="resources/${SKU}.jpg" alt="${SKU}"></a>`
            $(this).empty();
            $(this).append(img);
      });

      var list_top_viewed = XML_DATA.getElementsByTagName("Danh_sach_Top_View")[0];
      
      var book_top_viewed = list_top_viewed.getElementsByTagName("Sach");
      $("#carouselTopTenAccess .carousel-item").each(function (index) {
            var book = book_top_viewed[index];
            var SKU = book.getAttribute("SKU");
            var link_product = document.location.origin + `/detail_product?p=${SKU}`;
            var img = `<a href="${link_product}"><img class="img-fluid mx-auto d-block" src="resources/${SKU}.jpg" alt="${SKU}"></a>`
            $(this).empty();
            $(this).append(img);
      });
});