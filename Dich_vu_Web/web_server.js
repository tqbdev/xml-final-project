'use strict';

var app = require('http');
var fs = require('fs');
var query = require('querystring');
var PORT = 3000;

app.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    var accept = req.headers.accept;
    var original_url = req.url;

    switch (req.method) {
        case 'GET':
            if (!accept.includes("text/xml")) {
                // Xử lý nếu req chỉ '/' thì load nội dung file index.html
                var req_url = (req.url == '/') ? '/index.html' : req.url;

                // Xử lý các ứng dụng con
                req_url = (req.url.includes('/admin')) ? '/admin_page.html' : req_url;
                req_url = (req.url.includes('/list_product')) ? '/list_product_page.html' : req_url;
                req_url = (req.url.includes('/search')) ? '/list_product_page.html' : req_url;
                req_url = (req.url.includes('/detail_product')) ? '/detail_product_page.html' : req_url;
                req_url = (req.url.includes('/login')) ? '/login_page.html' : req_url;

                // Xử lý phần header res sẽ gửi về Client
                var file_extension = req_url.lastIndexOf('.');
                var header_type = (file_extension == -1 && req.url != '/') ?
                    'text/plain' : {
                        '/': 'text/html',
                        '.html': 'text/html',
                        '.ico': 'image/x-icon',
                        '.jpg': 'image/jpeg',
                        '.png': 'image/png',
                        '.gif': 'image/gif',
                        '.css': 'text/css',
                        '.js': 'text/javascript'
                    }[req_url.substr(file_extension)];

                // Đọc file theo req gửi từ Client lên
                fs.readFile(__dirname + req_url, (err, data) => {
                    if (err) {
                        // Xử lý phần tìm không thấy resource ở Server
                        console.log('==> Error: ' + err);
                        console.log('==> Error 404: file not found ' + res.url);

                        // Set Header của res thành 404 - Not found
                        res.writeHead(404, 'Not found');
                        res.end();
                    } else {
                        // Set Header cho res
                        res.setHeader('Content-type', header_type);

                        res.end(data);
                        //console.log(req.url, header_type);
                    }
                });
            } else {
                // send to data_server
                const options = {
                    port: 3001,
                    method: 'GET',
                    path: original_url
                };

                var res_string = "";
                const req = app.request(options, (response) => {
                    //console.log(`STATUS: ${res.statusCode}`);
                    //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                    response.setEncoding('utf8');
                    response.on('data', (chunk) => {
                        res_string += chunk;
                    });
                    response.on('end', () => {
                        res.setHeader('Content-type', 'text/xml');
                        res.end(res_string);
                    });
                });

                req.on('error', (e) => {
                    console.error(`problem with request: ${e.message}`);
                });

                // write data to request body
                // req.write(postData);
                req.end();

                // res.setHeader('Content-type', 'text/xml');
                // res.end("<Data></Data>");

                //console.log("TEST! OK");
            }
            break;
        case 'DELETE':
            break;
        case 'POST':
            break;
        case 'PUT':
            // ignore
            break;
    }
}).listen(PORT, (err) => {
    if (err != null)
        console.log('==> Error: ' + err);
    else
        console.log('Server is starting at port ' + PORT);
})