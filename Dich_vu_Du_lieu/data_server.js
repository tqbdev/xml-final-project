'use strict';

var app = require('http');
var url = require('url');
var query = require('querystring');
var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;
var crypto = require('crypto');

var PORT = 3001;

var HANDLE_DATA = require('./services/HANDLE_DATA.js');
var UPDATE = require('./services/UPDATE.js');

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

var viewed_data = GET.Viewed_Data();
var authencation_data = GET.Authencation_Data();

//var array_All_books = CONVERT.Convert_2_Array_Object(ALL_Books_XML);
var list = CONVERT.Convert_2_Publish_Revenue_Dict(VN_Books_XML, EN_Books_XML);
var publish_dict = list[0];
var revenue_dict = list[1];

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

var sortByPublish = publish_items.slice(0, 10);

var revenue_items = Object.keys(revenue_dict).map(function (key) {
    return [key, revenue_dict[key]];
});

revenue_items.sort(function (first, second) {
    return parseInt(second[1]) - parseInt(first[1]);
});

var sortByRevenue = revenue_items.slice(0, 10);

var viewed_items = Object.keys(viewed_data).map(function (key) {
    return [key, viewed_data[key]];
});

viewed_items.sort(function (first, second) {
    return parseInt(second[1]) - parseInt(first[1]);
});

var sortByView = viewed_items.slice(0, 10);

var revenueByMonth = HANDLE_DATA.List_Revenue_By_Month_Year(VN_Books_XML, EN_Books_XML, new Date().getFullYear());

console.log("Init complete...");

// JWT
var secret = Buffer.from('875bb9f6a445e07ce32ad9d0f39dce4f89143075d56f3ecb56de705c834dce22', 'hex');
var JWT = require('./services/JWT.js');

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

                    var data = new XMLSerializer().serializeToString(CONVERT.Join_3_Top_Array_2_XML(sortByPublish, sortByRevenue, sortByView));
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

                    var book = HANDLE_DATA.Get_Book(ALL_Books_XML, viewed_data, sku);
                    if (book != null) {
                        UPDATE.Update_Viewed_Data(viewed_data);
                        var viewed_items = Object.keys(viewed_data).map(function (key) {
                            return [key, viewed_data[key]];
                        });

                        viewed_items.sort(function (first, second) {
                            return parseInt(second[1]) - parseInt(first[1]);
                        });

                        sortByView = viewed_items.slice(0, 10);
                    }

                    var data = new XMLSerializer().serializeToString(book);

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

                case '/admin':
                    res.writeHeader(200, {
                        'Content-Type': 'text/xml'
                    });

                    var data = null;

                    var queryName = args.p;
                    switch (queryName) {
                        case 'stat':
                            data = CONVERT.Convert_Revenue_Month_2_XML(revenueByMonth);
                            data = new XMLSerializer().serializeToString(data);
                            break;
                        case 'products':
                            data = new XMLSerializer().serializeToString(CONVERT.Convert_2_Admin_Data(ALL_Books_XML, revenue_dict, viewed_data));
                            break;
                    }

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
                    var token = null;
                    if (authencation_data[username] == auth) {
                        token = JWT.encode({
                            exp: Date.now() / 1000 + 3600
                        }, secret);
                    } else {
                        console.log("ERR");
                    }

                    res.writeHeader(200, {
                        'Content-Type': 'text/plain'
                    });
                    res.end(token);
                    break;

                case '/admin':
                    var token_key = req.headers.token;

                    var data = null;
                    try {
                        var decoded = JWT.decode(token_key, secret);
                        data = "OK";
                    } catch (err) {
                        data = err.message;
                    }

                    res.writeHeader(200, {
                        'Content-Type': 'text/plain'
                    });
                    res.end(data);

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