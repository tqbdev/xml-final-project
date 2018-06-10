var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;
var xpathSelect = require("xpath.js");

class HANDLE_DATA {
      Get_Book(xml_data, sku) {
            var book = xpathSelect(
                  xml_data,
                  "/Danh_sach_Sach/Sach[@SKU='" + sku + "']"
            )[0];

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
}

var handle = new HANDLE_DATA();
module.exports = handle;