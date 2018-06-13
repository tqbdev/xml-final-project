var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;
var Book = require("../objects/book.js");
var xpathSelect = require("xpath.js");

class CONVERT {
      Convert_2_Little_XML(xml_data) {
            var result_xml = new DOMParser().parseFromString(
                  "<Danh_sach_Sach></Danh_sach_Sach>"
            );
            var list_book = result_xml.getElementsByTagName("Danh_sach_Sach")[0];

            var books = xml_data.getElementsByTagName("Sach");

            for (var i = 0; i < books.length; i++) {
                  var book = books.item(i);

                  var newBook = result_xml.createElement("Sach");
                  newBook.setAttribute("SKU", book.getAttribute("SKU"));
                  newBook.setAttribute("Ten", book.getAttribute("Ten"));
                  newBook.setAttribute("Gia_ban", book.getAttribute("Gia_ban"));

                  list_book.appendChild(newBook);
            }

            return result_xml;
      }

      JOIN_2_XML_Little(xml_data_1, xml_data_2) {
            var result_xml = new DOMParser().parseFromString(
                  "<Danh_sach_Sach></Danh_sach_Sach>"
            );
            var list_book = result_xml.getElementsByTagName("Danh_sach_Sach")[0];

            var books = xml_data_1.getElementsByTagName("Sach");

            for (var i = 0; i < books.length; i++) {
                  var book = books.item(i);

                  var newBook = result_xml.createElement("Sach");
                  newBook.setAttribute("SKU", book.getAttribute("SKU"));
                  newBook.setAttribute("Ten", book.getAttribute("Ten"));
                  newBook.setAttribute("Gia_ban", book.getAttribute("Gia_ban"));

                  list_book.appendChild(newBook);
            }

            var books = xml_data_2.getElementsByTagName("Sach");

            for (var i = 0; i < books.length; i++) {
                  var book = books.item(i);

                  var newBook = result_xml.createElement("Sach");
                  newBook.setAttribute("SKU", book.getAttribute("SKU"));
                  newBook.setAttribute("Ten", book.getAttribute("Ten"));
                  newBook.setAttribute("Gia_ban", book.getAttribute("Gia_ban"));

                  list_book.appendChild(newBook);
            }

            return result_xml;
      }

      JOIN_2_XML(xml_data_1, xml_data_2) {
            var result_xml = new DOMParser().parseFromString(
                  "<Danh_sach_Sach></Danh_sach_Sach>"
            );
            var list_book = result_xml.getElementsByTagName("Danh_sach_Sach")[0];

            var books = xml_data_1.getElementsByTagName("Sach");

            for (var i = 0; i < books.length; i++) {
                  var book = books.item(i);

                  var newBook = result_xml.createElement("Sach");
                  newBook.setAttribute("SKU", book.getAttribute("SKU"));
                  newBook.setAttribute("Ten", book.getAttribute("Ten"));
                  newBook.setAttribute("NXB", book.getAttribute("NXB"));
                  newBook.setAttribute("Tac_gia", book.getAttribute("Tac_gia"));
                  newBook.setAttribute("Gia_ban", book.getAttribute("Gia_ban"));
                  //newBook.setAttribute("Luot_xem", book.getAttribute("Luot_xem"));
                  newBook.setAttribute("Ngay_phat_hanh", book.getAttribute("Ngay_phat_hanh"));
                  newBook.setAttribute("So_luong_ton", book.getAttribute("So_luong_ton"));
                  newBook.setAttribute("Gia_nhap", book.getAttribute("Gia_nhap"));
                  newBook.setAttribute("Loai", book.getAttribute("Loai"));

                  list_book.appendChild(newBook);
            }

            var books = xml_data_2.getElementsByTagName("Sach");

            for (var i = 0; i < books.length; i++) {
                  var book = books.item(i);

                  var newBook = result_xml.createElement("Sach");
                  newBook.setAttribute("SKU", book.getAttribute("SKU"));
                  newBook.setAttribute("Ten", book.getAttribute("Ten"));
                  newBook.setAttribute("NXB", book.getAttribute("NXB"));
                  newBook.setAttribute("Tac_gia", book.getAttribute("Tac_gia"));
                  newBook.setAttribute("Gia_ban", book.getAttribute("Gia_ban"));
                  //newBook.setAttribute("Luot_xem", book.getAttribute("Luot_xem"));
                  newBook.setAttribute("Ngay_phat_hanh", book.getAttribute("Ngay_phat_hanh"));
                  newBook.setAttribute("So_luong_ton", book.getAttribute("So_luong_ton"));
                  newBook.setAttribute("Gia_nhap", book.getAttribute("Gia_nhap"));
                  newBook.setAttribute("Loai", book.getAttribute("Loai"));

                  list_book.appendChild(newBook);
            }

            return result_xml;
      }

      Convert_2_Array_Object(xml_data) {
            var book_array = [];

            var books = xml_data.getElementsByTagName("Sach");

            for (var i = 0; i < books.length; i++) {
                  var book = books.item(i);

                  var SKU = book.getAttribute("SKU");
                  var name = book.getAttribute("Ten");
                  var manufactorer = book.getAttribute("NXB");
                  var author = book.getAttribute("Tac_gia");
                  var price = book.getAttribute("Gia_ban");
                  var pulish_date = book.getAttribute("Ngay_phat_hanh");
                  var remain_count = book.getAttribute("So_luong_ton");
                  var price_import = book.getAttribute("Gia_nhap");
                  var type = book.getAttribute("Loai");

                  var book_object = new Book(SKU, name, manufactorer, author, price, pulish_date, remain_count, price_import, type);
                  book_array.push(book_object);
            }

            return book_array;
      }

      Convert_2_Publish_Revenue_Dict(xml_data1, xml_data2) {
            var publish = {};
            var revenue = {};

            var books = xml_data1.getElementsByTagName("Sach");

            for (var i = 0; i < books.length; i++) {
                  var book = books.item(i);

                  var SKU = book.getAttribute("SKU");
                  var publish_date = book.getAttribute("Ngay_phat_hanh");

                  publish[SKU] = publish_date;

                  var list_sell = book.getElementsByTagName("Ban_hang");
                  var total = 0;
                  for (var k = 0; k < list_sell.length; k++) {
                        var sell = list_sell.item(k);
                        var amount = sell.getAttribute("So_luong");
                        var price_sell = sell.getAttribute("Gia_ban");

                        total += parseInt(amount) * parseInt(price_sell);
                  }



                  revenue[SKU] = total;
            }

            var books = xml_data2.getElementsByTagName("Sach");

            for (var i = 0; i < books.length; i++) {
                  var book = books.item(i);

                  var SKU = book.getAttribute("SKU");
                  var publish_date = book.getAttribute("Ngay_phat_hanh");

                  publish[SKU] = publish_date;

                  var list_sell = book.getElementsByTagName("Ban_hang");
                  var total = 0;
                  for (var k = 0; k < list_sell.length; k++) {
                        var sell = list_sell.item(k);
                        var amount = sell.getAttribute("So_luong");
                        var price_sell = sell.getAttribute("Gia_ban");

                        total += parseInt(amount) * parseInt(price_sell);
                  }



                  revenue[SKU] = total;
            }

            return [publish, revenue];
      }

      Join_3_Top_Array_2_XML(sortByPublish, sortByRevenue, sortByView) {
            var result_xml = new DOMParser().parseFromString(
                  "<Danh_sach_Top></Danh_sach_Top>"
            );

            var list_top = result_xml.getElementsByTagName("Danh_sach_Top")[0];

            var Top_Publish = result_xml.createElement("Danh_sach_Top_New");
            for (var i = 0; i < sortByPublish.length; i++) {
                  var newBook = result_xml.createElement("Sach");
                  newBook.setAttribute("SKU", sortByPublish[i][0]);

                  Top_Publish.appendChild(newBook);
            }

            list_top.appendChild(Top_Publish);

            var Top_Revenue = result_xml.createElement("Danh_sach_Top_Revenue");
            for (var i = 0; i < sortByRevenue.length; i++) {
                  var newBook = result_xml.createElement("Sach");
                  newBook.setAttribute("SKU", sortByRevenue[i][0]);

                  Top_Revenue.appendChild(newBook);
            }

            list_top.appendChild(Top_Revenue);

            var Top_View = result_xml.createElement("Danh_sach_Top_View");
            for (var i = 0; i < sortByView.length; i++) {
                  var newBook = result_xml.createElement("Sach");
                  newBook.setAttribute("SKU", sortByView[i][0]);

                  Top_View.appendChild(newBook);
            }

            list_top.appendChild(Top_View);

            return result_xml;
      }

      Convert_Revenue_Month_2_XML(data) {
            var result_xml = new DOMParser().parseFromString(
                  "<Danh_sach_Doanh_thu></Danh_sach_Doanh_thu>"
            );

            var list_revenue = result_xml.getElementsByTagName("Danh_sach_Doanh_thu")[0];

            Object.keys(data).forEach(function (key) {
                  var newStat = result_xml.createElement("Doanh_thu");
                  newStat.setAttribute("Thang", key);
                  newStat.setAttribute("Sale", data[key]);
                  list_revenue.appendChild(newStat);
            });

            return result_xml;
      }

      Convert_2_Admin_Data(xml_data, revenue_data, viewed_data) {
            var result_xml = new DOMParser().parseFromString(
                  "<Danh_sach_Sach></Danh_sach_Sach>"
            );
            var list_book = result_xml.getElementsByTagName("Danh_sach_Sach")[0];

            var books = xml_data.getElementsByTagName("Sach");

            for (var i = 0; i < books.length; i++) {
                  var book = books.item(i);

                  var newBook = result_xml.createElement("Sach");
                  newBook.setAttribute("SKU", book.getAttribute("SKU"));
                  newBook.setAttribute("Ten", book.getAttribute("Ten"));
                  newBook.setAttribute("NXB", book.getAttribute("NXB"));
                  newBook.setAttribute("Tac_gia", book.getAttribute("Tac_gia"));
                  newBook.setAttribute("Gia_ban", book.getAttribute("Gia_ban"));
                  //newBook.setAttribute("Luot_xem", book.getAttribute("Luot_xem"));
                  newBook.setAttribute("Ngay_phat_hanh", book.getAttribute("Ngay_phat_hanh"));
                  newBook.setAttribute("So_luong_ton", book.getAttribute("So_luong_ton"));
                  newBook.setAttribute("Gia_nhap", book.getAttribute("Gia_nhap"));
                  newBook.setAttribute("Loai", book.getAttribute("Loai"));

                  newBook.setAttribute("Luot_xem", viewed_data[book.getAttribute("SKU")]);
                  newBook.setAttribute("Doanh_thu", revenue_data[book.getAttribute("SKU")]);

                  list_book.appendChild(newBook);
            }

            return result_xml;
      }

      Convert_2_Sale_XML(xml_data) {
            var result_xml = new DOMParser().parseFromString(
                  "<Danh_sach_Sach></Danh_sach_Sach>"
            );
            var list_book = result_xml.getElementsByTagName("Danh_sach_Sach")[0];

            var books = xml_data.getElementsByTagName("Sach");

            for (var i = 0; i < books.length; i++) {
                  var book = books.item(i);

                  var newBook = result_xml.createElement("Sach");
                  newBook.setAttribute("SKU", book.getAttribute("SKU"));
                  newBook.setAttribute("Ten", book.getAttribute("Ten"));
                  newBook.setAttribute("Tac_gia", book.getAttribute("Tac_gia"));
                  newBook.setAttribute("NXB", book.getAttribute("NXB"));
                  newBook.setAttribute("Loai", book.getAttribute("Loai"));
                  newBook.setAttribute("So_luong_ton", book.getAttribute("So_luong_ton"));
                  newBook.setAttribute("Gia_ban", book.getAttribute("Gia_ban"));

                  list_book.appendChild(newBook);
            }

            return result_xml;
      }

      JOIN_2_Sale_XML(xml_data1, xml_data2) {
            var result_xml = new DOMParser().parseFromString(
                  "<Danh_sach_Sach></Danh_sach_Sach>"
            );
            var list_book = result_xml.getElementsByTagName("Danh_sach_Sach")[0];

            var books = xml_data1.getElementsByTagName("Sach");

            for (var i = 0; i < books.length; i++) {
                  var book = books.item(i);

                  var newBook = result_xml.createElement("Sach");
                  newBook.setAttribute("SKU", book.getAttribute("SKU"));
                  newBook.setAttribute("Ten", book.getAttribute("Ten"));
                  newBook.setAttribute("Tac_gia", book.getAttribute("Tac_gia"));
                  newBook.setAttribute("NXB", book.getAttribute("NXB"));
                  newBook.setAttribute("Loai", book.getAttribute("Loai"));
                  newBook.setAttribute("So_luong_ton", book.getAttribute("So_luong_ton"));
                  newBook.setAttribute("Gia_ban", book.getAttribute("Gia_ban"));

                  list_book.appendChild(newBook);
            }

            books = xml_data2.getElementsByTagName("Sach");

            for (var i = 0; i < books.length; i++) {
                  var book = books.item(i);

                  var newBook = result_xml.createElement("Sach");
                  newBook.setAttribute("SKU", book.getAttribute("SKU"));
                  newBook.setAttribute("Ten", book.getAttribute("Ten"));
                  newBook.setAttribute("Tac_gia", book.getAttribute("Tac_gia"));
                  newBook.setAttribute("NXB", book.getAttribute("NXB"));
                  newBook.setAttribute("Loai", book.getAttribute("Loai"));
                  newBook.setAttribute("So_luong_ton", book.getAttribute("So_luong_ton"));
                  newBook.setAttribute("Gia_ban", book.getAttribute("Gia_ban"));

                  list_book.appendChild(newBook);
            }

            return result_xml;
      }
}

var convert = new CONVERT();
module.exports = convert;