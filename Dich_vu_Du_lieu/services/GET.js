var File = require("fs");
var format = require("pretty-data").pd;
var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;
var xpathSelect = require("xpath.js");

const DATA_PATH = __dirname + "/../data/";
const VN_BOOK = "Vietnamese_Books.xml";
const EN_BOOK = "English_Books.xml";

var GET = {
      Vietnamese_Books: function() {
            var XML_String = File.readFileSync(DATA_PATH + VN_BOOK, "UTF-8");
            var XML = new DOMParser().parseFromString(XML_String, "text/xml");
            return XML;
      },

      English_Books: function() {
            var XML_String = File.readFileSync(DATA_PATH + EN_BOOK, "UTF-8");
            var XML = new DOMParser().parseFromString(XML_String, "text/xml");
            return XML;
      }
}

module.exports = GET;