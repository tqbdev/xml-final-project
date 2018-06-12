var File = require("fs");
var format = require("pretty-data").pd;
var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;
var xpathSelect = require("xpath.js");

const DATA_PATH = __dirname + "/../data/";
const VN_BOOK = "Vietnamese_Books.xml";
const EN_BOOK = "English_Books.xml";

const VIEWED_DATA = "Viewed_Data.json";
const AUTHENCATION_FILE = "userdata.json";

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
      },

      Viewed_Data: function() {
            var JSON_String = File.readFileSync(DATA_PATH + VIEWED_DATA, "UTF-8");
            var jsonData = JSON.parse(JSON_String);

            return jsonData;
      },

      Authencation_Data: function() {
            var JSON_String = File.readFileSync(DATA_PATH + AUTHENCATION_FILE, "UTF-8");
            var jsonData = JSON.parse(JSON_String).Authencation;

            var dict = {};

            for (let i = 0; i < jsonData.length; i++) {
                  var user = jsonData[i].username;
                  var pass = jsonData[i].password;

                  dict[user] = pass;
            }

            return dict;
      }
}

module.exports = GET;