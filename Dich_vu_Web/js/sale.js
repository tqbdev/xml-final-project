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
var table_data = null;

function removeRow(source) {
      $(source).parent().parent().empty();
      totalPrice();
}

function addBook(SKU, price, name, remain) {
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
                                          <input type="number" class="form-control" value=1 max="${remain}" oninput="changeAmount(this, ${price})">
                                    </td>
                                    <td>${Convert_Price_String(price) + " đ"}</td>
                              </tr>`;
            $("#table_sale_body").prepend(tr);

            totalPrice();
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

      totalPrice();
}

function Convert(a) {
      var x = a.replace(/,/g, "");
      x = x.replace("đ", "");
      return parseInt(x);
}

function totalPrice() {
      var total = 0;
      var prevAll = $("#total").parent().prevAll();
      for (var i = 0; i < prevAll.length; i++) {
            if (prevAll[i] == null || prevAll[i].lastElementChild == null) {
                  continue;
            }
            var priceStr = prevAll[i].lastElementChild.innerHTML;
            var prevPrice = Convert(priceStr);
            total += prevPrice;
      }
      $("#total").html(`${Convert_Price_String(total)+ " đ"}`);
}

function clearAllRow() {
      $("#table_sale_body").html('');
      var tr =
            `<tr>
                        <td colspan="5" style="text-align: right;">Tổng thành tiền</td>
                        <td id="total">0 đ</td>
                  </tr>`;
      $("#table_sale_body").append(tr);
}

$(document).ready(function () {
      $("#btn_clear").click(function () {
            clearAllRow();
      });

      $("#btn_checkout").click(function () {
            checkOut();
      });


      requireRevenue();
      requireProducts();
});

function requireRevenue() {
      $.ajax({
            headers: {
                  'token': window.localStorage.getItem('Token-key')
            },
            url: "/admin?p=stat",
            dataType: "xml",
            type: 'GET',

            success: function (data) {
                  if (data != "") {
                        var revenue = parseInt(data.getElementsByTagName("Thong_ke")[0].getAttribute("Doanh_thu"));
                        $("#revenue").html(`Tổng doanh thu cá nhân: ${Convert_Price_String(revenue)} đ`);
                        console.log("OK");
                  }
            },
            error: function (xhr, status, error) {
                  console.log("Error");
            }
      });
}

function requireProducts() {
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

                        table_data = $("#table_product").DataTable({
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

                        document.getElementById("loader").style.display = "none";
                        document.getElementById("table").style.display = "block";

                        console.log("OK");
                  }
            },
            error: function (xhr, status, error) {
                  console.log("Error");
            }
      });
}

function checkOut() {
      var xmlRoot = "<Danh_sach_Ban_hang></Danh_sach_Ban_hang>";
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(xmlRoot, "text/xml");

      var list_sale = xmlDoc.getElementsByTagName("Danh_sach_Ban_hang")[0];

      var prevAll = $("#total").parent().prevAll();

      if (prevAll.length == 0) {
            alert("Không có sản phẩm để thanh toán");
      } else {
            for (var i = 0; i < prevAll.length; i++) {
                  if (prevAll[i] == null || prevAll[i].lastElementChild == null) {
                        continue;
                  }

                  var SKU = $(prevAll[i]).children().eq(1).html();
                  var price = Convert($(prevAll[i]).children().eq(3).html());
                  var amount = $(prevAll[i]).children().eq(4)[0].firstElementChild.value;

                  var book = xmlDoc.createElement("Sach");
                  book.setAttribute("SKU", SKU);
                  book.setAttribute("Gia_ban", price);
                  book.setAttribute("So_luong", amount);

                  list_sale.appendChild(book);
            }

            var serializer = new XMLSerializer();
            var xmlString = serializer.serializeToString(xmlDoc);

            $.ajax({
                  headers: {
                        'token': window.localStorage.getItem('Token-key')
                  },
                  url: "/sale",
                  data: xmlString,
                  dataType: "xml",
                  type: 'POST',

                  success: function (data) {
                        if (data != "") {
                              var result = data.getElementsByTagName("Ket_qua")[0];
                              var mess = result.getAttribute("mess");

                              alert(mess);
                              if (mess == "Thanh toán thành công") {
                                    //window.location.href = document.location.href;
                                    table_data.destroy();
                                    document.getElementById("loader").style.display = "block";
                                    document.getElementById("table").style.display = "none";
                                    requireRevenue();
                                    requireProducts();
                                    console.log(mess);
                              }
                              console.log("OK");
                        }
                  },
                  error: function (xhr, status, error) {
                        console.log("Error");
                  }
            });
      }
}

function Load_Products() {
      $("#table_body").html('');
      var books = XML_DATA_PRODUCTS.getElementsByTagName("Sach");

      for (var i = 0; i < books.length; i++) {
            var book = books[i];

            let SKU = book.getAttribute("SKU");
            let name = book.getAttribute("Ten");
            var author = book.getAttribute("Tac_gia");
            let remain_amount = book.getAttribute("So_luong_ton");
            let price_sale = book.getAttribute("Gia_ban");
            var type = book.getAttribute("Loai");
            var manufactorer = book.getAttribute("NXB");

            var bgColor = ``;
            var disable = ``;
            if (parseInt(remain_amount) <= 0) {
                  bgColor = `style="background-color:orange"`;
                  disable = `disabled`;
            }

            var tr = `<tr ${bgColor}>
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
                  <button class="btn btn-primary" id="btn_add_book_${i}" ${disable}>Thêm</button>
            </td>
      </tr>`

            $("#table_body").append(tr);
            var btn = document.getElementById(`btn_add_book_${i}`);
            btn.onclick = function () {
                  var remain = parseInt(remain_amount);
                  if (remain > 0) {
                        addBook(SKU, price_sale, name, remain);
                  } else {
                        alert("Số lượng tồn không đủ");
                  }
            };
      }
}