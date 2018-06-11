"use strict";

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