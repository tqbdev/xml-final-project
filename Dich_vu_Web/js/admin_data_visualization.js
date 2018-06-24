"use strict";

jQuery.extend(jQuery.fn.dataTableExt.oSort, {
      "numeric-comma-pre": function (a) {
            var x = a.replace(/,/g, "");
            x = x.replace("đ", "");
            // x = x.replace(",", "");
            // x = x.replace(",", "");
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

jQuery.extend(jQuery.fn.dataTableExt.oSort, {
      "publish-date-pre": function (a) {
            var x = "01/" + a;
            return Date.parse(x);
      },

      "publish-date-asc": function (a, b) {
            return ((a < b) ? -1 : ((a > b) ? 1 : 0));
      },

      "publish-date-desc": function (a, b) {
            return ((a < b) ? 1 : ((a > b) ? -1 : 0));
      }
});

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
      'November', 'December'
];

var XML_DATA_STAT = null;
var XML_DATA_PRODUCTS = null;

var table_data = null;

$(document).ready(function () {
      $("#addDoneBtn").click(function () {
            addProduct();
      });

      $("#editDoneBtn").click(function () {
            editProduct();
      });

      $("#modalAddItem").on("shown.bs.modal", function (e) {
            clearAddModal();
      });

      requireTotalRevenue();
      requireProducts();
});

function clearAddModal() {
      $("#new_id").val('');
      $("#new_name").val('');
      $("#new_author").val('');
      $("#new_type").val('');
      $("#new_manufacturer").val('');
      $("#new_publish").val('');
      $("#new_price_sale").val('');
      $("#new_price_import").val('');
      $("#new_stock_amount").val('');
}

function editProduct() {
      var edit_id = $("#edit_id").val();
      var edit_name = $("#edit_name").val();
      var edit_author = $("#edit_author").val();
      var edit_manufacturer = $("#edit_manufacturer").val();
      var edit_type = $("#edit_type").val();
      var edit_price_sale = $("#edit_price_sale").val();
      var edit_publish_date = $("#edit_publish").val();
      var edit_price_import = $("#edit_price_import").val();
      var edit_stock_amount = $("#edit_stock_amount").val();

      if (edit_id == "" ||
            edit_name == "" ||
            edit_author == "" ||
            edit_manufacturer == "" ||
            edit_type == "" ||
            edit_publish_date == "" ||
            edit_price_sale == "" ||
            edit_price_import == "" ||
            edit_stock_amount == "") {

            alert("Bạn phải hoàn tất biểu mẫu");
            return;
      }

      if (isNaN(parseInt(edit_price_sale)) ||
            isNaN(parseInt(edit_price_import)) ||
            isNaN(parseInt(edit_stock_amount))) {
            alert("Một số trường bạn nhập không phù hợp");
            return;
      }

      var editProductXMLStr = `<Sua_sach SKU="${edit_id}" Ten="${edit_name}" NXB="${edit_manufacturer}" Tac_gia="${edit_author}" Gia_ban="${edit_price_sale}" Ngay_phat_hanh="${edit_publish_date}" So_luong_ton="${edit_stock_amount}" Gia_nhap="${edit_price_import}" Loai="${edit_type}"></Sua_sach>`;

      $.ajax({
            headers: {
                  'token': window.localStorage.getItem('Token-key')
            },
            url: "/edit-product",
            dataType: "xml",
            type: 'POST',
            data: editProductXMLStr,

            success: function (data) {
                  if (data != "") {
                        var result = data.getElementsByTagName("Ket_qua")[0];
                        var mess = result.getAttribute("mess");

                        alert(mess);
                        if (mess == "Chỉnh sửa thành công") {
                              table_data.destroy();
                              document.getElementById("loader").style.display = "block";
                              document.getElementById("table").style.display = "none";
                              requireTotalRevenue();
                              requireProducts();
                              console.log(mess);
                        }
                        console.log("OK");
                        $("#modalEditItem").modal('hide');
                  }
            },
            error: function (xhr, status, error) {
                  console.log("Error");
            }
      });
}

function addProduct() {
      var new_id = $("#new_id").val();
      var new_name = $("#new_name").val();
      var new_author = $("#new_author").val();
      var new_manufacturer = $("#new_manufacturer").val();
      var new_type = $("#new_type").val();
      var new_price_sale = $("#new_price_sale").val();
      var new_publish_date = $("#new_publish").val();
      var new_price_import = $("#new_price_import").val();
      var new_stock_amount = $("#new_stock_amount").val();
      var new_lang = $('input[name=lang]:checked', '#new_lang').val();

      if (new_id == "" ||
            new_name == "" ||
            new_author == "" ||
            new_manufacturer == "" ||
            new_type == "" ||
            new_price_sale == "" ||
            new_publish_date == "" ||
            new_price_import == "" ||
            new_stock_amount == "" ||
            new_lang === undefined) {

            alert("Bạn phải hoàn tất biểu mẫu");
            return;
      }

      if (isNaN(parseInt(new_price_sale)) ||
            isNaN(parseInt(new_price_import)) ||
            isNaN(parseInt(new_stock_amount))) {
            alert("Một số trường bạn nhập không phù hợp");
            return;
      }

      var newProductXMLStr = `<Them_sach SKU="${new_id}" Ten="${new_name}" NXB="${new_manufacturer}" Tac_gia="${new_author}" Gia_ban="${new_price_sale}" Ngay_phat_hanh="${new_publish_date}" So_luong_ton="${new_stock_amount}" Gia_nhap="${new_price_import}" Loai="${new_type}" lang="${new_lang}"></Them_sach>`;

      $.ajax({
            headers: {
                  'token': window.localStorage.getItem('Token-key')
            },
            url: "/add-product",
            dataType: "xml",
            type: 'POST',
            data: newProductXMLStr,

            success: function (data) {
                  if (data != "") {
                        var result = data.getElementsByTagName("Ket_qua")[0];
                        var mess = result.getAttribute("mess");

                        alert(mess);
                        if (mess == "Thêm thành công") {
                              table_data.destroy();
                              document.getElementById("loader").style.display = "block";
                              document.getElementById("table").style.display = "none";
                              requireTotalRevenue();
                              requireProducts();
                              console.log(mess);
                        }
                        console.log("OK");
                        $("#modalAddItem").modal('hide');
                  }
            },
            error: function (xhr, status, error) {
                  console.log("Error");
            }
      });
}

function requireTotalRevenue() {
      $.ajax({
            headers: {
                  'token': window.localStorage.getItem('Token-key')
            },
            url: "/admin?p=stat",
            dataType: "xml",
            type: 'GET',

            success: function (data) {
                  if (data != "") {
                        XML_DATA_STAT = data;
                        drawChart();

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
                                    "targets": [2, 13]
                              }, {
                                    "targets": [0, 2, 6, 8, 9, 10, 11, 12],
                                    "searchable": false
                              }, {
                                    "type": "numeric-comma",
                                    "targets": [8, 9, 12]
                              }]
                        });
                        console.log("OK");
                  }
            },
            error: function (xhr, status, error) {
                  console.log("Error");
            }
      });
}

function CreateArrayWithXMLStat() {
      var result = {};
      var list_stat = XML_DATA_STAT.getElementsByTagName("Doanh_thu");

      for (var i = 0; i < list_stat.length; i++) {
            var stat = list_stat[i];
            var sale = stat.getAttribute("Sale");

            if (sale == "null") {
                  result[parseInt(stat.getAttribute("Thang"))] = null;
            } else {
                  result[parseInt(stat.getAttribute("Thang"))] = parseInt(sale);
            }
      }

      var result_items = Object.keys(result).map(function (key) {
            return [parseInt(key), result[key]];
      });

      result_items.sort(function (first, second) {
            return parseInt(first[0]) - parseInt(second[0]);
      });

      var result_arr = [];
      for (var i = 0; i < result_items.length; i++) {
            result_arr[i] = result_items[i][1];
      }

      return result_arr;
}

function drawChart() {
      var dataArray = CreateArrayWithXMLStat();

      var ctx = document.getElementById("myChart");
      var now = new Date();
      new Chart(ctx, {
            type: 'line',
            data: {
                  labels: MONTHS,
                  datasets: [{
                        label: 'Tổng doanh thu',
                        backgroundColor: 'green',
                        borderColor: 'green',
                        data: dataArray,
                        fill: false
                  }]
            },
            options: {
                  responsive: true,
                  title: {
                        display: true,
                        text: 'Tổng doanh thu theo tháng trong năm ' + now.getFullYear(),
                        fontSize: 20,
                  },
                  tooltips: {
                        mode: 'index',
                        intersect: false,
                  },
                  hover: {
                        mode: 'nearest',
                        intersect: true
                  },
                  scales: {
                        xAxes: [{
                              display: true,
                              scaleLabel: {
                                    display: true,
                                    labelString: 'Month',
                                    fontSize: 16
                              }
                        }],
                        yAxes: [{
                              display: true,
                              scaleLabel: {
                                    display: true,
                                    labelString: 'Revenue',
                                    fontSize: 16
                              }
                        }]
                  }
            }
      });
}

function Load_Products() {
      $("#table_body").html('');
      var books = XML_DATA_PRODUCTS.getElementsByTagName("Sach");
      $("#amount").html(`Có tổng cộng: <span style="color: red">${books.length}</span> sản phẩm`)

      for (let i = 0; i < books.length; i++) {
            var book = books[i];

            let SKU = book.getAttribute("SKU");
            var name = book.getAttribute("Ten");
            var author = book.getAttribute("Tac_gia");
            var remain_amount = book.getAttribute("So_luong_ton");
            var price_sale = book.getAttribute("Gia_ban");
            var price_import = book.getAttribute("Gia_nhap");
            var view_count = book.getAttribute("Luot_xem");
            var type = book.getAttribute("Loai");
            var manufactorer = book.getAttribute("NXB");
            var revenue = book.getAttribute("Doanh_thu");
            var publish_date = book.getAttribute("Ngay_phat_hanh");

            var bgColor = ``;
            if (parseInt(remain_amount) <= 0) {
                  bgColor = `style="background-color:orange"`;
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
            <td>${publish_date}</td>
            <td>${type}</td>
            <td>${Convert_Price_String(price_sale) + " đ"}</td>
            <td>${Convert_Price_String(price_import) + " đ"}</td>
            <td>${remain_amount}</td>
            <td>${view_count}</td>
            <td>${Convert_Price_String(revenue) + " đ"}</td>
            <td>
                  <button class="btn btn-warning" id="btnEditItem_${i}">Edit</button>
                  <br>
                  <br>
                  <br>
                  <button class="btn btn-danger" id="btnDeleteItem_${i}">Delete</button>
            </td>
      </tr>`

            $("#table_body").append(tr);
            document.getElementById(`btnDeleteItem_${i}`).onclick = function () {
                  deleteBook(SKU);
            };

            document.getElementById(`btnEditItem_${i}`).onclick = function () {
                  editBook(SKU);
            };
      }

      document.getElementById("loader").style.display = "none";
      document.getElementById("table").style.display = "block";
}

function editBook(SKU) {
      setDataEditModal(SKU);
}

function convertDate(originalDate) {
      var res = originalDate.split('-');

      var month = res[0];
      var year = res[1];

      return `${year}-${month}-01`;
}

function setDataEditModal(SKU) {
      $("#modalEditItem").modal("show");

      var path = `/Danh_sach_Sach/Sach[@SKU="${SKU}"]`;
      var book = XML_DATA_PRODUCTS.evaluate(path, XML_DATA_PRODUCTS, null, XPathResult.ANY_TYPE, null).iterateNext();

      if (book == null || book === undefined) {
            return;
      }

      var originalDate = book.getAttribute("Ngay_phat_hanh");

      $("#edit_id").val(book.getAttribute("SKU"));
      $("#edit_name").val(book.getAttribute("Ten"));
      $("#edit_author").val(book.getAttribute("Tac_gia"));
      $("#edit_type").val(book.getAttribute("Loai"));
      $("#edit_manufacturer").val(book.getAttribute("NXB"));
      $("#edit_publish").val(convertDate(originalDate));
      $("#edit_price_sale").val(parseInt(book.getAttribute("Gia_ban")));
      $("#edit_price_import").val(parseInt(book.getAttribute("Gia_nhap")));
      $("#edit_stock_amount").val(parseInt(book.getAttribute("So_luong_ton")));
}

function deleteBook(SKU) {
      if (confirm(`Bạn có muốn xoá sản phẩm có mã là ${SKU}?`)) {
            $.ajax({
                  headers: {
                        'token': window.localStorage.getItem('Token-key')
                  },
                  url: `/delete-product`,
                  dataType: "xml",
                  type: 'POST',
                  data: `<Xoa SKU="${SKU}"></Xoa>`,

                  success: function (data) {
                        if (data != "") {
                              var result = data.getElementsByTagName("Ket_qua")[0];
                              var mess = result.getAttribute("mess");

                              alert(mess);
                              if (mess == "Xoá thành công") {
                                    table_data.destroy();
                                    document.getElementById("loader").style.display = "block";
                                    document.getElementById("table").style.display = "none";
                                    requireTotalRevenue();
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