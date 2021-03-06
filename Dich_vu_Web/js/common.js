"use strict";

$(document).ready(function () {
  $("#login").click(function () {
    //$("#modalLogin").modal("show");
    window.location.href = document.location.origin + "/login";
  });

  $("#logout").click(function () {
    window.localStorage.removeItem('Token-key');
    window.location.href = document.location.origin;
  });

  $("#btn_search").click(function () {
    if ($("#query_input").val().trim() == "") {
      //alert("Query string cannot be empty");
      $("#query_input").css('border-color', 'red');
      $("#query_input").css('border-width', '3px');
    } else {
      window.location.href =
        document.location.origin + "/search?q=" + $("#query_input").val();
    }
  });

  $("#query_input").keypress(function (event) {
    $("#query_input").css('border-color', '#34495e');
    $("#query_input").css('border-width', '1px');

    if (event.which == 13) {
      if ($("#query_input").val().trim() == "") {
        alert("Query string cannot be empty");
      } else {
        window.location.href =
          document.location.origin + "/search?q=" + $("#query_input").val();
      }
    }
  });

  $("#href_home").click(function () {
    window.location.href = document.location.origin;
  });

  var url = document.URL;
  if (url.includes("p=all")) {
    $("#all_product").addClass("active");
  } else if (url.includes("p=vietnamese")) {
    $("#vietnamese_product").addClass("active");
  } else if (url.includes("p=english")) {
    $("#english_product").addClass("active");
  }

  if (url.includes("search?q=")) {
    var query_string = url.substring(url.indexOf("q=") + 2);
    $("#query_input").val(decodeURIComponent(query_string));
  }

  $("#all_product").click(function () {
    window.location.href = document.location.origin + "/list_product?p=all";
  });

  $("#vietnamese_product").click(function () {
    window.location.href =
      document.location.origin + "/list_product?p=vietnamese";
  });

  $("#english_product").click(function () {
    window.location.href = document.location.origin + "/list_product?p=english";
  });
});

const numberWithCommas = x => {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

function Convert_Price_String(price_string) {
  return numberWithCommas(price_string);
}