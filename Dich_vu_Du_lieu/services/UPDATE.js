var File = require("fs");
var format = require("pretty-data").pd;
var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;
var xpathSelect = require("xpath.js");

const DATA_PATH = __dirname + "/../data/";
const VIEWED_DATA = "Viewed_Data.json";

function nowDay() {
      var d = new Date();

      month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('/');
}

var UPDATE = {
      Update_Viewed_Data: function (data) {
            var jsonStr = format.json(JSON.stringify(data));
            File.writeFileSync(DATA_PATH + VIEWED_DATA, jsonStr, 'utf-8');
      },

      Update_Revenue_Dict: function (revenue_dict, Sale_XML_Str) {
            var Sale_XML = new DOMParser().parseFromString(Sale_XML_Str, "text/xml");
            var books = Sale_XML.getElementsByTagName("Sach");

            for (var i = 0; i < books.length; i++) {
                  var book = books[i];

                  var SKU = book.getAttribute("SKU");
                  var price = book.getAttribute("Gia_ban");
                  var amount = book.getAttribute("So_luong");

                  var revenue = revenue_dict[SKU];

                  if (revenue === undefined) {
                        revenue_dict[SKU] = parseInt(price) * parseInt(amount);
                  } else {
                        revenue_dict[SKU] = parseInt(revenue_dict[SKU]) + (parseInt(price) * parseInt(amount));
                  }
            }
      },

      Update_Sale_Staff: function (xml_data, revenue_staff_dict, Sale_XML_Str, username) {
            var staff_in_xml = xpathSelect(
                  xml_data,
                  "/Danh_sach_Ban_hang/Nhan_vien[@username='" +
                  username +
                  "']"
            )[0];

            if (staff_in_xml == null || staff_in_xml == undefined) {
                  var list_sale = xml_data.getElementsByTagName("Danh_sach_Ban_hang")[0];

                  staff_in_xml = xml_data.createElement("Nhan_vien");
                  staff_in_xml.setAttribute("username", username);

                  list_sale.appendChild(staff_in_xml);
            }

            var Sale_XML = new DOMParser().parseFromString(Sale_XML_Str, "text/xml");
            var books = Sale_XML.getElementsByTagName("Sach");

            var total = 0;
            for (var i = 0; i < books.length; i++) {
                  var book = books[i];

                  var SKU = book.getAttribute("SKU");
                  var price = book.getAttribute("Gia_ban");
                  var amount = book.getAttribute("So_luong");
                  var day_sale = nowDay();

                  total += parseInt(price) * parseInt(amount);

                  var sale = xml_data.createElement("Ban_hang");
                  sale.setAttribute("SKU", SKU);
                  sale.setAttribute("Gia_ban", price);
                  sale.setAttribute("So_luong", amount);
                  sale.setAttribute("Ngay_ban", day_sale);

                  staff_in_xml.appendChild(sale);
            }

            if (revenue_staff_dict[username] === undefined) {
                  revenue_staff_dict[username] = 0;
            }

            revenue_staff_dict[username] += total;
      }
}

module.exports = UPDATE;