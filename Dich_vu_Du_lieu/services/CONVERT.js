var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;
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
                  newBook.setAttribute("Luot_xem", book.getAttribute("Luot_xem"));
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
                  newBook.setAttribute("Luot_xem", book.getAttribute("Luot_xem"));
                  newBook.setAttribute("Ngay_phat_hanh", book.getAttribute("Ngay_phat_hanh"));
                  newBook.setAttribute("So_luong_ton", book.getAttribute("So_luong_ton"));
                  newBook.setAttribute("Gia_nhap", book.getAttribute("Gia_nhap"));
                  newBook.setAttribute("Loai", book.getAttribute("Loai"));

                  list_book.appendChild(newBook);
            }

            return result_xml;
      }
}

var convert = new CONVERT();
module.exports = convert;