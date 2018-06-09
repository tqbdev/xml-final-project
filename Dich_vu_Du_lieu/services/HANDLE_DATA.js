var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;
var xpathSelect = require("xpath.js");

class HANDLE_DATA {
      Find_Book(xml_data, sku) {
            var book = xpathSelect(
                  xml_data,
                  "/Danh_sach_Sach/Sach[@SKU='" + sku + "']"
            )[0];

            return book;
      }
}

var handle = new HANDLE_DATA();
module.exports = handle;