"use strict";

// Load google charts
google.charts.load('current', {
      'packages': ['corechart']
});
google.charts.setOnLoadCallback(drawChart);

// Draw the chart and set the chart values
function drawChart() {
      var dataItems = google.visualization.arrayToDataTable([
            ['Loại', 'Số lượng'],
            ['Truyện tranh', 80],
            ['Trinh thám', 20],
            ['Tiểu thuyết', 20],
            ['Báo chí', 30],
            ['Tạp chí', 20],
            ['Văn học', 70]
      ]);

      // Optional; add a title and set the width and height of the chart
      var optionsItems = {
            'title': 'Số sản phẩm theo loại',
            'width': 'auto',
            'height': 400
      };

      var dataRevenue = google.visualization.arrayToDataTable([
            ['Doanh thu', 'Số tiền'],
            ['Truyện tranh', 1000000],
            ['Trinh thám', 2000000],
            ['Tiểu thuyết', 3000000],
            ['Báo chí', 1000000],
            ['Tạp chí', 2000000],
            ['Văn học', 3000000]
      ]);

      // Optional; add a title and set the width and height of the chart
      var optionsRevenue = {
            'title': 'Doanh thu theo loại',
            'width': 'auto',
            'height': 400
      };

      // Display the chart inside the <div> element with id="piechart"
      var chart = new google.visualization.PieChart(document.getElementById('piechartItems'));
      chart.draw(dataItems, optionsItems);

      var chart = new google.visualization.PieChart(document.getElementById('piechartRevenue'));
      chart.draw(dataRevenue, optionsRevenue);
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
      'November', 'December'
];

var ctx = document.getElementById("myChart");
var myChart = new Chart(ctx, {
      type: 'line',
      data: {
            labels: MONTHS,
            datasets: [{
                  label: 'Tổng doanh thu',
                  backgroundColor: 'green',
                  borderColor: 'green',
                  data: [100000, 210000, 120000, 180000, 140000, 170000, 160000, 170000,
                        180000, 120000, 110000, 200000
                  ],
                  fill: false
            }]
      },
      options: {
            responsive: true,
            title: {
                  display: true,
                  text: 'Tổng doanh thu theo tháng',
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