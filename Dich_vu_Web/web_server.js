'use strict';

var app = require('http');
var fs = require('fs');
var query = require('querystring');
var PORT = 3000;

app.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    var data_receive = "";

    var headers = req.headers;
    var accept = req.headers.accept;
    var original_url = req.url;

    req.on("data", chunk => {
        data_receive += chunk;
    });

    req.on("end", () => {
        switch (req.method) {
            case 'GET':
                if (!accept.includes("text/xml")) {
                    // Xử lý nếu req chỉ '/' thì load nội dung file index.html
                    if (accept.includes("html")) {
                        var req_url = (req.url == '/') ? '/index.html' : req.url;

                        // Xử lý các ứng dụng con
                        req_url = (req.url.includes('/admin')) ? '/admin_load.html' : req_url;
                        req_url = (req.url.includes('/list_product')) ? '/list_product_page.html' : req_url;
                        req_url = (req.url.includes('/search')) ? '/list_product_page.html' : req_url;
                        req_url = (req.url.includes('/detail_product')) ? '/detail_product_page.html' : req_url;
                        req_url = (req.url.includes('/login')) ? '/login_page.html' : req_url;
                    } else {
                        var req_url = req.url;
                    }

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
                    var token_key = headers.token;

                    original_url = (original_url == '/') ? '/index' : original_url;
                    const options = {
                        port: 3001,
                        method: 'GET',
                        path: original_url,
                        headers: {
                            token: token_key == null ? null : token_key
                        }
                    };

                    var res_string = "";
                    const request = app.request(options, (response) => {
                        //console.log(`STATUS: ${res.statusCode}`);
                        //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                        response.setEncoding('utf8');
                        response.on('data', (chunk) => {
                            res_string += chunk;
                        });
                        response.on('end', () => {
                            //console.log(res_string);
                            res.setHeader('Content-type', 'text/xml');
                            res.end(res_string);
                        });
                    });

                    request.on('error', (e) => {
                        console.error(`problem with request: ${e.message}`);
                    });

                    // write data to request body
                    // req.write(postData);
                    request.end();

                    // res.setHeader('Content-type', 'text/xml');
                    // res.end("<Data></Data>");

                    //console.log("TEST! OK");
                }
                break;
            case 'DELETE':
                break;
            case 'POST':
                switch (original_url) {
                    case '/login':
                        {
                            const options = {
                                port: 3001,
                                method: 'POST',
                                path: original_url,
                                headers: {
                                    username: headers.username,
                                    password: headers.password
                                }
                            };

                            var res_string = "";
                            const request = app.request(options, (response) => {
                                response.setEncoding('utf8');
                                response.on('data', (chunk) => {
                                    res_string += chunk;
                                });
                                response.on('end', () => {
                                    res.setHeader('Content-type', 'text/plain');
                                    res.setHeader('Token', res_string);
                                    res.end();
                                });
                            });

                            request.on('error', (e) => {
                                console.error(`problem with request: ${e.message}`);
                            });

                            request.end();
                        }
                        break;
                    case '/admin':
                        {
                            var token_key = headers.token;

                            const options = {
                                port: 3001,
                                method: 'POST',
                                path: original_url,
                                headers: {
                                    token: token_key
                                }
                            };

                            var res_string = "";
                            const request = app.request(options, (response) => {
                                response.setEncoding('utf8');
                                response.on('data', (chunk) => {
                                    res_string += chunk;
                                });
                                response.on('end', () => {
                                    res.setHeader('Content-type', 'text/html');

                                    if (res_string == "") {
                                        fs.readFile(__dirname + '/admin_404.html', (err, data) => {
                                            if (err) {
                                                console.log('==> Error: ' + err);
                                                console.log('==> Error 404: file not found ' + res.url);
                                                res.writeHead(404, 'Not found');
                                                res.end();
                                            } else {
                                                res.end(data);
                                            }
                                        });
                                    } else {
                                        var decoded = JSON.parse(res_string);
                                        var isAdmin = decoded.admin;
                                        if (isAdmin) {
                                            fs.readFile(__dirname + '/admin_page.html', (err, data) => {
                                                if (err) {
                                                    console.log('==> Error: ' + err);
                                                    console.log('==> Error 404: file not found ' + res.url);
                                                    res.writeHead(404, 'Not found');
                                                    res.end();
                                                } else {
                                                    data = data.toString().replace("######", decoded.user);
                                                    res.end(data);
                                                }
                                            });
                                        } else {
                                            fs.readFile(__dirname + '/sale_page.html', (err, data) => {
                                                if (err) {
                                                    console.log('==> Error: ' + err);
                                                    console.log('==> Error 404: file not found ' + res.url);
                                                    res.writeHead(404, 'Not found');
                                                    res.end();
                                                } else {
                                                    data = data.toString().replace("######", decoded.user);
                                                    res.end(data);
                                                }
                                            });
                                        }
                                    }
                                });
                            });

                            request.on('error', (e) => {
                                console.error(`problem with request: ${e.message}`);
                            });

                            request.end();
                        }
                        break;

                    case '/sale':
                        {
                            var token_key = headers.token;

                            const options = {
                                port: 3001,
                                method: 'POST',
                                path: original_url,
                                headers: {
                                    token: token_key
                                }
                            };

                            var res_string = "";
                            const request = app.request(options, (response) => {
                                response.setEncoding('utf8');
                                response.on('data', (chunk) => {
                                    res_string += chunk;
                                });
                                response.on('end', () => {
                                    res.setHeader('Content-type', 'text/xml');
                                    res.end(res_string);
                                });
                            });

                            request.on('error', (e) => {
                                console.error(`problem with request: ${e.message}`);
                            });

                            request.end(data_receive);
                        }
                        break;
                }
                break;
            case 'PUT':
                // ignore
                break;
        }
    });
}).listen(PORT, (err) => {
    if (err != null)
        console.log('==> Error: ' + err);
    else
        console.log('Server is starting at port ' + PORT);
});