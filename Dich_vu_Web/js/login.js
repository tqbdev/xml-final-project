"use strict";

$(document).ready(function () {
      $("#btn_login").click(function () {
            if ($("#input_username").val().trim() == "" || $("#input_password").val().trim() == "") {
                  alert("username or password cannot be empty.");
            } else {
                  $.ajax({
                        headers: {
                              username: $("#input_username").val(),
                              password: $("#input_password").val()
                        },
                        url: document.url,
                        dataType: "xml",
                        type: 'POST',

                        success: function (data) {
                              console.log("OK");
                        },
                        error: function (xhr, status, error) {
                              console.log("Error");
                        }
                  });
            }
      });
});