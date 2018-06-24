var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;
var xpathSelect = require("xpath.js");
var CONVERT = require("./CONVERT.js");

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

      Get_Top_10_Viewed(viewed_data) {
            var viewed_items = Object.keys(viewed_data).map(function (key) {
                  return [key, viewed_data[key]];
            });

            viewed_items.sort(function (first, second) {
                  return parseInt(second[1]) - parseInt(first[1]);
            });

            return viewed_items.slice(0, 10);
      }

      Get_Top_10_Publish(publish_dict) {
            var publish_items = Object.keys(publish_dict).map(function (key) {
                  return [key, publish_dict[key]];
            });

            publish_items.sort(function (first, second) {
                  var dateA = "01/" + first[1];
                  dateA = dateA.replace("-", "/");
                  dateA = Date.parse(dateA);
                  var dateB = "01/" + second[1];
                  dateB = dateB.replace("-", "/");
                  dateB = Date.parse(dateB);

                  return dateB - dateA;
            });

            return publish_items.slice(0, 10);
      }

      Get_Top_10_Revenue(revenue_dict) {
            var revenue_items = Object.keys(revenue_dict).map(function (key) {
                  return [key, revenue_dict[key]];
            });

            revenue_items.sort(function (first, second) {
                  return parseInt(second[1]) - parseInt(first[1]);
            });

            return revenue_items.slice(0, 10);
      }

      Delete_Book(VN_Books_XML, EN_Books_XML, SKU) {
            var book = xpathSelect(
                  VN_Books_XML,
                  "/Danh_sach_Sach/Sach[@SKU='" +
                  SKU +
                  "']"
            )[0];

            if (book == null || book == undefined) {
                  book = xpathSelect(
                        EN_Books_XML,
                        "/Danh_sach_Sach/Sach[@SKU='" +
                        SKU +
                        "']"
                  )[0];

                  if (book == null || book == undefined) {
                        throw "Lỗi! Không tìm thấy sách";
                  } else {
                        var list = EN_Books_XML.getElementsByTagName("Danh_sach_Sach")[0];
                        list.removeChild(book);

                        return 'EN';
                  }
            } else {
                  var list = VN_Books_XML.getElementsByTagName("Danh_sach_Sach")[0];
                  list.removeChild(book);

                  return 'VN';
            }
      }

      Check_SKU_Exist(xml_data) {
            var book = xpathSelect(
                  xml_data,
                  "/Danh_sach_Sach/Sach[@SKU='" +
                  SKU +
                  "']"
            )[0];

            if (book == null || book == undefined) {
                  return false;
            }

            return true;
      }

      Add_Book(xml_data, book_xml) {
            var list_book = xml_data.getElementsByTagName("Danh_sach_Sach")[0];

            var new_book = xml_data.createElement("Sach");
            new_book.setAttribute("SKU", book_xml.getAttribute("SKU"));
            new_book.setAttribute("Ten", book_xml.getAttribute("Ten"));
            new_book.setAttribute("NXB", book_xml.getAttribute("NXB"));
            new_book.setAttribute("Tac_gia", book_xml.getAttribute("Tac_gia"));
            new_book.setAttribute("Gia_ban", book_xml.getAttribute("Gia_ban"));
            new_book.setAttribute("Ngay_phat_hanh", book_xml.getAttribute("Ngay_phat_hanh"));
            new_book.setAttribute("So_luong_ton", book_xml.getAttribute("So_luong_ton"));
            new_book.setAttribute("Gia_nhap", book_xml.getAttribute("Gia_nhap"));
            new_book.setAttribute("Loai", book_xml.getAttribute("Loai"));

            list_book.appendChild(new_book);
      }

      Edit_Book(VN_Books_XML, EN_Books_XML, book_xml) {
            var book = xpathSelect(
                  VN_Books_XML,
                  "/Danh_sach_Sach/Sach[@SKU='" +
                  SKU +
                  "']"
            )[0];

            if (book == null || book == undefined) {
                  book = xpathSelect(
                        EN_Books_XML,
                        "/Danh_sach_Sach/Sach[@SKU='" +
                        SKU +
                        "']"
                  )[0];

                  if (book == null || book == undefined) {
                        throw "Lỗi! Không tìm thấy sách";
                  } else {
                        book.setAttribute("Ten", book_xml.getAttribute("Ten"));
                        book.setAttribute("NXB", book_xml.getAttribute("NXB"));
                        book.setAttribute("Tac_gia", book_xml.getAttribute("Tac_gia"));
                        book.setAttribute("Gia_ban", book_xml.getAttribute("Gia_ban"));
                        book.setAttribute("Ngay_phat_hanh", book_xml.getAttribute("Ngay_phat_hanh"));
                        book.setAttribute("So_luong_ton", book_xml.getAttribute("So_luong_ton"));
                        book.setAttribute("Gia_nhap", book_xml.getAttribute("Gia_nhap"));
                        book.setAttribute("Loai", book_xml.getAttribute("Loai"));

                        return 'EN';
                  }
            } else {
                  book.setAttribute("Ten", book_xml.getAttribute("Ten"));
                  book.setAttribute("NXB", book_xml.getAttribute("NXB"));
                  book.setAttribute("Tac_gia", book_xml.getAttribute("Tac_gia"));
                  book.setAttribute("Gia_ban", book_xml.getAttribute("Gia_ban"));
                  book.setAttribute("Ngay_phat_hanh", book_xml.getAttribute("Ngay_phat_hanh"));
                  book.setAttribute("So_luong_ton", book_xml.getAttribute("So_luong_ton"));
                  book.setAttribute("Gia_nhap", book_xml.getAttribute("Gia_nhap"));
                  book.setAttribute("Loai", book_xml.getAttribute("Loai"));

                  return 'VN';
            }
      }
}

var handle = new HANDLE_DATA();
module.exports = handle;