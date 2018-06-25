var File = require("fs");
var format = require("pretty-data").pd;
var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;
var xpathSelect = require("xpath.js");

const VN = 1,
      EN = 2;

const DATA_PATH = __dirname + "/../data/";
const VN_BOOK = "Vietnamese_Books.xml";
const EN_BOOK = "English_Books.xml";

const SALE_DATA = "Sale_Data.xml";

function nowDay() {
      var d = new Date();

      month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('/');
}

var POST = {
      Sale_Product: function (VN_Books_XML, EN_Books_XML, Sale_XML_Str, permit) {
            var Sale_XML = new DOMParser().parseFromString(Sale_XML_Str, "text/xml");
            var books = Sale_XML.getElementsByTagName("Sach");

            for (var i = 0; i < books.length; i++) {
                  var book = books[i];

                  var SKU = book.getAttribute("SKU");
                  var price = book.getAttribute("Gia_ban");
                  var amount = book.getAttribute("So_luong");
                  var day_sale = nowDay();

                  var book_in_vn_xml = xpathSelect(
                        VN_Books_XML,
                        "/Danh_sach_Sach/Sach[@SKU='" +
                        SKU +
                        "']"
                  )[0];

                  var book_in_en_xml = xpathSelect(
                        EN_Books_XML,
                        "/Danh_sach_Sach/Sach[@SKU='" +
                        SKU +
                        "']"
                  )[0];

                  var book_in_xml = null;
                  var check = 0;
                  if (book_in_vn_xml == null) {
                        book_in_xml = book_in_en_xml;
                        check = EN;
                  } else {
                        book_in_xml = book_in_vn_xml;
                        check = VN;
                  }

                  if (book_in_xml == null || book_in_xml === undefined) {
                        throw "Lỗi! Không tìm thấy mã SKU của sách";
                  } else {
                        if (permit & 1 != check) {
                              throw "Lỗi! Bạn không có quyền thanh toán";
                        }
                  }

                  var remain_count = book_in_xml.getAttribute("So_luong_ton");
                  if (remain_count < amount) {
                        throw "Lỗi! Số lượng hàng không đủ để thanh toán";
                  }

                  var new_remain_count = parseInt(remain_count) - parseInt(amount);
                  book_in_xml.setAttribute("So_luong_ton", new_remain_count);

                  var list_sale = null;
                  if (check & VN) {
                        list_sale = xpathSelect(
                              VN_Books_XML,
                              "/Danh_sach_Sach/Sach[@SKU='" +
                              SKU +
                              "']/Danh_sach_Ban_hang"
                        )[0];

                        if (list_sale == null || list_sale === undefined) {
                              list_sale = VN_Books_XML.createElement("Danh_sach_Ban_hang");
                              book_in_xml.appendChild(list_sale);
                        }

                        var new_sale = VN_Books_XML.createElement("Ban_hang");
                        new_sale.setAttribute("Ngay_ban", day_sale);
                        new_sale.setAttribute("So_luong", amount);
                        new_sale.setAttribute("Gia_ban", price);

                        list_sale.appendChild(new_sale);
                  } else if (check & EN) {
                        list_sale = xpathSelect(
                              EN_Books_XML,
                              "/Danh_sach_Sach/Sach[@SKU='" +
                              SKU +
                              "']/Danh_sach_Ban_hang"
                        )[0];

                        if (list_sale == null || list_sale === undefined) {
                              list_sale = EN_Books_XML.createElement("Danh_sach_Ban_hang");
                              book_in_xml.appendChild(list_sale);
                        }

                        var new_sale = VN_Books_XML.createElement("Ban_hang");
                        new_sale.setAttribute("Ngay_ban", day_sale);
                        new_sale.setAttribute("So_luong", amount);
                        new_sale.setAttribute("Gia_ban", price);

                        list_sale.appendChild(new_sale);
                  }
            }
      },

      Save_VN_Book_XML: function (xml_data) {
            var XML_String = format.xml(new XMLSerializer().serializeToString(xml_data));
            File.writeFileSync(DATA_PATH + VN_BOOK, XML_String, "utf-8");
      },

      Save_EN_Book_XML: function (xml_data) {
            var XML_String = format.xml(new XMLSerializer().serializeToString(xml_data));
            File.writeFileSync(DATA_PATH + EN_BOOK, XML_String, "utf-8");
      },

      Save_Sale_Staff_XML: function (xml_data) {
            var XML_String = format.xml(new XMLSerializer().serializeToString(xml_data));
            File.writeFileSync(DATA_PATH + SALE_DATA, XML_String, "utf-8");
      }
}

module.exports = POST;