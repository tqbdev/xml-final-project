var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;
var xpathSelect = require("xpath.js");

class HANDLE_DATA {
      Get_Book(xml_data, viewed_data, sku) {
            var book = xpathSelect(
                  xml_data,
                  "/Danh_sach_Sach/Sach[@SKU='" + sku + "']"
            )[0];

            if (book != null) {
                  var count = ++viewed_data[sku];
                  book.setAttribute("Luot_xem", count);
            }

            return book;
      }

      Find_Book(xml_data, queryName) {
            queryName = queryName.toUpperCase();

            var result_xml = new DOMParser().parseFromString(
                  "<Danh_sach_Sach></Danh_sach_Sach>"
            );
            var list_book = result_xml.getElementsByTagName("Danh_sach_Sach")[0];

            var books = xml_data.getElementsByTagName("Sach");

            for (var i = 0; i < books.length; i++) {
                  var book = books.item(i);

                  var nameBook = book.getAttribute("Ten").toString().toUpperCase();

                  if (nameBook.includes(queryName)) {
                        var newBook = result_xml.createElement("Sach");
                        newBook.setAttribute("SKU", book.getAttribute("SKU"));
                        newBook.setAttribute("Ten", book.getAttribute("Ten"));
                        newBook.setAttribute("Gia_ban", book.getAttribute("Gia_ban"));

                        list_book.appendChild(newBook);
                  }
            }

            return result_xml;
      }

      List_Revenue_By_Month_Year(xml_data1, xml_data2, year) {
            var revenue = {
                  0: null,
                  1: null,
                  2: null,
                  3: null,
                  4: null,
                  5: null,
                  6: null,
                  7: null,
                  8: null,
                  9: null,
                  10: null,
                  11: null
            }

            var sales = xml_data1.getElementsByTagName("Ban_hang");

            for (var i = 0; i < sales.length; i++) {
                  var sale = sales.item(i);

                  var amount = sale.getAttribute("So_luong");
                  var price = sale.getAttribute("Gia_ban");
                  var date_sale = sale.getAttribute("Ngay_ban");

                  date_sale = new Date(date_sale);

                  if (date_sale.getFullYear() == year) {
                        var month = parseInt(date_sale.getMonth());

                        if (revenue[month] == null) {
                              revenue[month] = parseInt(amount) * parseInt(price);
                        } else {
                              revenue[month] += parseInt(amount) * parseInt(price);
                        }
                  } 
            }

            var sales = xml_data2.getElementsByTagName("Ban_hang");

            for (var i = 0; i < sales.length; i++) {
                  var sale = sales.item(i);

                  var amount = sale.getAttribute("So_luong");
                  var price = sale.getAttribute("Gia_ban");
                  var date_sale = sale.getAttribute("Ngay_ban");

                  date_sale = new Date(date_sale);

                  if (date_sale.getFullYear() == year) {
                        var month = parseInt(date_sale.getMonth());

                        if (revenue[month] == null) {
                              revenue[month] = parseInt(amount) * parseInt(price);
                        } else {
                              revenue[month] += parseInt(amount) * parseInt(price);
                        }
                  } 
            }

            return revenue;
      }
}

var handle = new HANDLE_DATA();
module.exports = handle;