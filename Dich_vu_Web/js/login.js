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
            if (event.which == 13) {
                  login();
            }
      });

      $("#input_password").keypress(function (event) {
            if (event.which == 13) {
                  login();
            }
      });
});

function login() {
      if ($("#input_username").val().trim() == "" || $("#input_password").val().trim() == "") {
            alert("username or password cannot be empty.");
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
                              alert("Login error.\r\nUsername or password not match.");
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