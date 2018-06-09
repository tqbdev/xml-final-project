'use strict';

var app = require('http');
var url = require('url');
var query = require('querystring');
var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;

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

console.log("Init complete...");

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
    var req_origin = req_url.substring(0, index);
    var querystring = req_url.substring(index + 1);
    var args = query.parse(querystring);
    //console.log(args);


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

                    var data = new XMLSerializer().serializeToString(HANDLE_DATA.Find_Book(ALL_Books_XML, sku));
                    
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
            var getMethod = require('./services/getMethod.js');

            switch (req.url) {
                case '/login':
                    // console.log(req.headers)
                    // console.log(req.body)

                    let body = [];
                    req.on('data', (chunk) => {
                        body.push(chunk);
                    }).on('end', () => {
                        body = Buffer.concat(body).toString();

                        // body = body.split('--X-INSOMNIA-BOUNDARY')
                        // console.log(body)
                        // body.splice(0,0)
                        // body.splice(body.size, 1)



                        // var reg = /--X-INSOMNIA-BOUNDARY/gi
                        // body = body.replace(reg,'|')
                        // reg = /Content-Disposition: form-data;/gi
                        // body = body.replace(reg,'|')
                        // reg = /(\\r\\n\\r)/gi
                        // body = body.replace(reg,'&')
                        // console.log(body)
                        // var arrString = body.split('--X-INSOMNIA-BOUNDARY\r\nContent-Disposition: form-data;')
                        //
                        // console.log(arrString)
                    });

                    session.push(101);
                    console.log(session);
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
            break;
        case 'DELETE':
            break;
    }
}).listen(PORT, (err) => {
    if (err != null)
        console.log('==> Error: ' + err);
    else
        console.log('Data server is starting at port ' + PORT);
})