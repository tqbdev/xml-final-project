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
      var name = book.getAttribute("Ten");
      var author = book.getAttribute("Tac_gia");
      var remain_amount = book.getAttribute("So_luong_ton");
      var price = book.getAttribute("Gia_ban");
      var view_count = book.getAttribute("Luot_xem");
      var type = book.getAttribute("Loai");
      var manufactorer = book.getAttribute("NXB");

      $("#name_product").empty();
      $("#name_product").html(name);

      $("#price_product").empty();
      $("#price_product").html(Convert_Price_String(price) + " đ");   

      $("#type_product").empty();
      $("#type_product").html(type);

      $("#manufactorer_product").empty(); 
      $("#manufactorer_product").html(manufactorer);

      $("#author_product").empty(); 
      $("#author_product").html("Tác giả: " + author);

      $("#view_count").empty(); 
      $("#view_count").html("Lượt xem: " + view_count);

      $("#remain_count").empty(); 
      $("#remain_count").html("Kho còn: " + remain_amount);

      $("#sku_product").empty(); 
      $("#sku_product").html("SKU code: " + SKU);

      $("#product_img_div").empty();

      var img = `<img id="product_image" class="product_img" src="resources/${SKU}.jpg" alt="" data-zoom-image="resources/${SKU}.jpg">`
      $("#product_img_div").append(img);

      $("#product_image").ezPlus();
});