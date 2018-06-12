"use strict";

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
      'November', 'December'
];

var XML_DATA_STAT = null;
var XML_DATA_PRODUCTS = null;

$(document).ready(function () {
      $.ajax({
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

      $.ajax({
            url: "/admin?p=products",
            dataType: "xml",
            type: 'GET',

            success: function (data) {
                  if (data != "") {
                        XML_DATA_PRODUCTS = data;
                        Load_Products();
                        console.log("OK");
                  }
            },
            error: function (xhr, status, error) {
                  console.log("Error");
            }
      });
});

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
      var myChart = new Chart(ctx, {
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
      var books = XML_DATA_PRODUCTS.getElementsByTagName("Sach");
      $("#amount").html(`Có tổng cộng: <span style="color: red">${books.length}</span> sản phẩm`)

      for (var i = 0; i < books.length; i++) {
            var book = books[i];

            var SKU = book.getAttribute("SKU");
            var name = book.getAttribute("Ten");
            var author = book.getAttribute("Tac_gia");
            var remain_amount = book.getAttribute("So_luong_ton");
            var price_sale = book.getAttribute("Gia_ban");
            var price_import = book.getAttribute("Gia_nhap");
            var view_count = book.getAttribute("Luot_xem");
            var type = book.getAttribute("Loai");
            var manufactorer = book.getAttribute("NXB");
            var revenue = book.getAttribute("Doanh_thu");

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
            <td>${Convert_Price_String(price_import) + " đ"}</td>
            <td>${remain_amount}</td>
            <td>${view_count}</td>
            <td>${Convert_Price_String(revenue) + " đ"}</td>
            <td>
                  <button class="btn btn-warning" id="btnEditItem">Edit</button>
                  <br>
                  <br>
                  <br>
                  <button class="btn btn-danger" id="btnEditItem">Delete</button>
            </td>
      </tr>`

            $("#table_body").append(tr);
      }
}