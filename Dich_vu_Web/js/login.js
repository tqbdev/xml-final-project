"use strict";

window.onload = function() {
      if (window.localStorage.getItem('Token-key')) {
            window.location.href = document.location.origin + "/admin";
      }
}

$(document).ready(function () {
      $("#btn_login").click(function () {
            login();
      });

      $("#input_username").keypress(function (event) {
            $("#empty_message").css('display', 'none');
            if (event.which == 13) {
                  login();
            }
      });

      $("#input_password").keypress(function (event) {
            $("#empty_message").css('display', 'none');
            if (event.which == 13) {
                  login();
            }
      });
});

function login() {
      $("#error_message").css('display', 'none');

      if ($("#input_username").val().trim() == "" || $("#input_password").val().trim() == "") {
            $("#empty_message").css('display', 'block');
      } else {
            $.ajax({
                  headers: {
                        username: $("#input_username").val(),
                        password: $("#input_password").val()
                  },
                  url: document.url,
                  dataType: "text",
                  type: 'POST',

                  success: function (data, textStatus, jqXHR) {
                        var token = jqXHR.getResponseHeader("Token");
                        if (token == "") {
                              $("#error_message").css('display', 'block');
                        } else {
                              window.localStorage.setItem('Token-key', token);
                              window.location.href = document.location.origin + "/admin";
                        }
                  },
                  error: function (xhr, status, error) {
                        alert("Login error.\r\n" + error.message);
                  }
            });
      }
}