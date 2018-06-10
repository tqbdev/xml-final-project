'use strict';

var app = require('http');
var url = require('url');
var query = require('querystring');
var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;
var crypto = require('crypto');

var PORT = 3001;

var HANDLE_DATA = require('./services/HANDLE_DATA.js');

// Loading data
var GET = require('./services/GET.js');
var CONVERT = require('./services/CONVERT.js');

console.log("Init data...");
var VN_Books_XML = GET.Vietnamese_Books();
var EN_Books_XML = GET.English_Books();
var ALL_Books_XML = CONVERT.JOIN_2_XML(VN_Books_XML, EN_Books_XML);
var VN_Books_XML_Little = CONVERT.Convert_2_Little_XML(VN_Books_XML);
var EN_Books_XML_Little = CONVERT.Convert_2_Little_XML(EN_Books_XML);
var ALL_Books_XML_Little = CONVERT.JOIN_2_XML_Little(VN_Books_XML_Little, EN_Books_XML_Little);

var authencation_data = GET.Authencation_Data();

var array_All_books = CONVERT.Convert_2_Array_Object(ALL_Books_XML);
var sortByPublish = array_All_books.sort(function (a, b) {
    var dateA = "01/" + a.getpulish_date;
    dateA = dateA.replace("-", "/");
    dateA = Date.parse(dateA);
    var dateB = "01/" + b.getpulish_date;
    dateB = dateB.replace("-", "/");
    dateB = Date.parse(dateB);


    return dateB - dateA;
});
var sortByView = array_All_books.sort(function (a, b) {
    var viewedA = parseInt(a.getviewed);
    var viewedB = parseInt(b.getviewed);

    return viewedB - viewedA;
});

console.log("Init complete...");

try {
    var JWT = require('./services/JWT.js');
    var secret = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex');
    var token = JWT.encode({
        'test': 'test'
    }, secret);
    var secret = Buffer.from('fe1a1915a379f3be5394b64d14794931', 'hex');
    var decoded = JWT.decode(token, secret);
    console.log(token);
    console.log(decoded);
} catch (err) {
    console.log(err.message);
}
var session = [];

function checkAuth(headers) {
    var uid = headers.uid;
    for (var i = 0; i < session.length; i++) {
        if (uid == session[i]) {
            return true;
        }
    }
    return false;
}

app.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    var req_url = req.url;
    var index = req_url.indexOf('?');
    var req_origin = (index == -1) ? req_url : req_url.substring(0, index);
    var querystring = req_url.substring(index + 1);
    var args = query.parse(querystring);

    switch (req.method) {
        case 'GET':
            var getMethod = require('./services/GET.js');

            switch (req_origin) {
                case '/Store':
                    if (checkAuth(req.headers) === true) {
                        res.writeHeader(200, {
                            'Content-Type': 'text/xml'
                        });
                        var data = getMethod.get_CuaHang();
                        res.end(data);
                    } else {
                        res.writeHeader(404, {
                            'Content-Type': 'text/plain'
                        });
                        res.end("Request was not support!!!");
                    }
                    break;

                case '/index':
                    res.writeHeader(200, {
                        'Content-Type': 'text/xml'
                    });

                    var data = "<Danh_sach></Danh_sach>"

                    res.end(data);
                    break;

                case '/list_product':
                    res.writeHeader(200, {
                        'Content-Type': 'text/xml'
                    });

                    var data = null;

                    switch (args.p) {
                        case 'all':
                            data = new XMLSerializer().serializeToString(ALL_Books_XML_Little);
                            break;
                        case 'vietnamese':
                            data = new XMLSerializer().serializeToString(VN_Books_XML_Little);
                            break;
                        case 'english':
                            data = new XMLSerializer().serializeToString(EN_Books_XML_Little);
                            break;
                    }

                    res.end(data);
                    break;

                case '/detail_product':
                    res.writeHeader(200, {
                        'Content-Type': 'text/xml'
                    });

                    var sku = args.p;

                    var data = new XMLSerializer().serializeToString(HANDLE_DATA.Get_Book(ALL_Books_XML, sku));

                    res.end(data);
                    break;

                case '/search':
                    res.writeHeader(200, {
                        'Content-Type': 'text/xml'
                    });

                    var data = null;

                    var queryName = args.q;
                    data = new XMLSerializer().serializeToString(HANDLE_DATA.Find_Book(ALL_Books_XML, queryName));

                    res.end(data);
                    break;

                default:
                    res.writeHeader(404, {
                        'Content-Type': 'text/plain'
                    });
                    res.end("Request was not support!!!");
                    break;
            }

            console.log('--> Done');
            break;
        case 'POST':
            switch (req.url) {
                case '/login':
                    var username = req.headers.username;
                    var password = req.headers.password;

                    var auth = crypto.createHmac('sha256', username).update(password).digest('hex');
                    if (authencation_data[username] == auth) {
                        console.log("OK");
                    } else {
                        console.log("ERR");
                    }

                    res.writeHeader(200, {
                        'Content-Type': 'text/plain'
                    });
                    res.end('101');
                    break;

                default:
                    res.writeHeader(404, {
                        'Content-Type': 'text/plain'
                    });
                    res.end("Request was not support!!!");
                    break;
            }
            break;
        case 'PUT':
            res.writeHeader(404, {
                'Content-Type': 'text/plain'
            });
            res.end("Request was not support!!!");
            break;
        case 'DELETE':
            break;
    }
}).listen(PORT, (err) => {
    if (err != null)
        console.log('==> Error: ' + err);
    else
        console.log('Data server is starting at port ' + PORT);
});