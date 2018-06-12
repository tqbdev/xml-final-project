var File = require("fs");
var format = require("pretty-data").pd;
var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;
var xpathSelect = require("xpath.js");

const DATA_PATH = __dirname + "/../data/";
const VIEWED_DATA = "Viewed_Data.json";

var UPDATE = {
      Update_Viewed_Data: function(data) {
            var jsonStr = format.json(JSON.stringify(data));
            File.writeFileSync(DATA_PATH + VIEWED_DATA, jsonStr, 'utf-8');
      }
}

module.exports = UPDATE;