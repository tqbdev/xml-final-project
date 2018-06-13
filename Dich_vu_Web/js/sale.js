"use strict";

jQuery.extend(jQuery.fn.dataTableExt.oSort, {
      "numeric-comma-pre": function (a) {
            var x = a.replace(",", "");
            x = x.replace("đ", "");
            x = x.replace(",", "");
            //console.log(x);
            return parseFloat(x);
      },

      "numeric-comma-asc": function (a, b) {
            return ((a < b) ? -1 : ((a > b) ? 1 : 0));
      },

      "numeric-comma-desc": function (a, b) {
            return ((a < b) ? 1 : ((a > b) ? -1 : 0));
      }
});

var XML_DATA_PRODUCTS = null;

function removeRow(source) {
      $(source).parent().parent().empty();
}

function addBook(SKU, price, name) {
      var check = true;
      var sku_exist = document.getElementsByName("SKU_Code");
      for (var i = 0; i < sku_exist.length; i++) {
            if (sku_exist[i].innerHTML == SKU) {
                  check = false;
                  alert("Already added!");
            }
      }

      if (check) {
            var tr =
                  `<tr>
                                    <td>
                                          <button class="btn btn-danger" onclick="removeRow(this)">Bỏ</button>
                                    </td>
                                    <td name="SKU_Code">${SKU}</td>
                                    <td>${name}</td>
                                    <td>${Convert_Price_String(price) + " đ"}</td>
                                    <td>
                                          <input type="number" class="form-control" value=1 oninput="changeAmount(this, ${price})">
                                    </td>
                                    <td>${Convert_Price_String(price) + " đ"}</td>
                              </tr>`;
            $("#table_sale_body").append(tr);
      }
}

function changeAmount(source, price) {
      var amount = parseInt(source.value);

      if (isNaN(amount)) {
            source.value = 1;
      } else {
            var total = $(source).parent().next();
            total.html(`${Convert_Price_String(parseInt(price) * amount) + " đ"}`);
      }
}

$(document).ready(function () {
      // $("#btn_add").click(function () {
      //       var tr =
      //             `<tr>
      //                               <td>
      //                                     <button class="btn btn-danger" onclick="removeRow(this)">Bỏ</button>
      //                               </td>
      //                               <td>
      //                                     <input type="text" class="form-control" placeholder="Nhập SKU" id="input_sku_0">
      //                               </td>
      //                               <td></td>
      //                               <td></td>
      //                               <td>
      //                                     <input type="number" class="form-control">
      //                               </td>
      //                               <td></td>
      //                         </tr>`;
      //       $("#table_sale_body").append(tr);
      //       $("#input_sku_0").autocomplete({
      //             source: SKU_ARR
      //       });
      // });

      $("#btn_clear").click(function () {
            $("#table_sale_body").html('');
            var tr =
                  `<tr>
                                    <td>
                                          <button class="btn btn-danger" onclick="removeRow(this)">Bỏ</button>
                                    </td>
                                    <td>
                                          <input type="text" class="form-control" placeholder="Nhập SKU">
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                          <input type="number" class="form-control">
                                    </td>
                                    <td></td>
                              </tr>`;
            $("#table_sale_body").append(tr);
      });

      $.ajax({
            headers: {
                  'token': window.localStorage.getItem('Token-key')
            },
            url: "/admin?p=products",
            dataType: "xml",
            type: 'GET',

            success: function (data) {
                  if (data != "") {
                        XML_DATA_PRODUCTS = data;
                        Load_Products();

                        $("#table_product").DataTable({
                              "columnDefs": [{
                                    "orderable": false,
                                    "targets": 2
                              }, {
                                    "targets": [0, 2, 7, 8, 9],
                                    "searchable": false
                              }, {
                                    "type": "numeric-comma",
                                    "targets": [7]
                              }]
                        });
                        console.log("OK");
                  }
            },
            error: function (xhr, status, error) {
                  console.log("Error");
            }
      });
});

function Load_Products() {
      var books = XML_DATA_PRODUCTS.getElementsByTagName("Sach");

      for (var i = 0; i < books.length; i++) {
            var book = books[i];

            let SKU = book.getAttribute("SKU");
            let name = book.getAttribute("Ten");
            var author = book.getAttribute("Tac_gia");
            var remain_amount = book.getAttribute("So_luong_ton");
            let price_sale = book.getAttribute("Gia_ban");
            var type = book.getAttribute("Loai");
            var manufactorer = book.getAttribute("NXB");

            var tr = `<tr>
            <td>${i}</td>
            <td>${SKU}</td>
            <td>
                  <img width="100" src="resources/${SKU}.jpg">
            </td>
            <td>${name}</td>
            <td>${author}</td>
            <td>${manufactorer}</td>
            <td>${type}</td>
            <td>${Convert_Price_String(price_sale) + " đ"}</td>
            <td>${remain_amount}</td>
            <td>
                  <button class="btn btn-primary" id="btn_add_book_${i}">Thêm</button>
            </td>
      </tr>`

            $("#table_body").append(tr);
            var btn = document.getElementById(`btn_add_book_${i}`);
            btn.onclick = function () {
                  addBook(SKU, price_sale, name);
            };
      }
}