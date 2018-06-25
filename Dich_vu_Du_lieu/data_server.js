'use strict';

const VN = 1,
    EN = 2,
    ALL = 3;

var app = require('http');
var url = require('url');
var query = require('querystring');
var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;
var crypto = require('crypto');

var PORT = 3001;

var HANDLE_DATA = require('./services/HANDLE_DATA.js');
var UPDATE = require('./services/UPDATE.js');
var POST = require('./services/POST.js');

// Loading data
var GET = require('./services/GET.js');
var CONVERT = require('./services/CONVERT.js');

console.log("Init data...");
var VN_Books_XML = GET.Vietnamese_Books();
var EN_Books_XML = GET.English_Books();
var ALL_Books_XML = CONVERT.JOIN_2_XML(VN_Books_XML, EN_Books_XML);

var Sale_Staff_XML = GET.Sale_Data();
var revenue_staff_dict = CONVERT.Convert_2_Revenue_Staff_Dict(Sale_Staff_XML);

// Data for list product
var VN_Books_XML_Little = CONVERT.Convert_2_Little_XML(VN_Books_XML);
var EN_Books_XML_Little = CONVERT.Convert_2_Little_XML(EN_Books_XML);
var ALL_Books_XML_Little = CONVERT.JOIN_2_XML_Little(VN_Books_XML_Little, EN_Books_XML_Little);

// Sale data
var VN_Books_Sale_XML = CONVERT.Convert_2_Sale_XML(VN_Books_XML);
var EN_Books_Sale_XML = CONVERT.Convert_2_Sale_XML(EN_Books_XML);
var ALL_Books_Sale_XML = CONVERT.JOIN_2_Sale_XML(VN_Books_Sale_XML, EN_Books_Sale_XML);

// JWT - user data
var authencation_data = GET.Authencation_Data();

// Viewed count data in a json file
var viewed_data = GET.Viewed_Data();

// TOP 10 data
var list = CONVERT.Convert_2_Publish_Revenue_Dict(VN_Books_XML, EN_Books_XML);
var publish_dict = list[0];
var revenue_dict = list[1];

var sortByPublish = HANDLE_DATA.Get_Top_10_Publish(publish_dict);
var sortByRevenue = HANDLE_DATA.Get_Top_10_Revenue(revenue_dict);
var sortByView = HANDLE_DATA.Get_Top_10_Viewed(viewed_data);

// Statistic
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

    var data_receive = "";

    req.on("data", chunk => {
        data_receive += chunk;
    });

    req.on("end", () => {
        switch (req.method) {
            case 'GET':
                var getMethod = require('./services/GET.js');

                switch (req_origin) {
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
                            sortByView = HANDLE_DATA.Get_Top_10_Viewed(viewed_data);
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
                        {
                            res.writeHeader(200, {
                                'Content-Type': 'text/xml'
                            });

                            var data = null;

                            var queryName = args.p;
                            var token_key = req.headers.token;

                            if (token_key != null) {
                                var check = true;
                                try {
                                    var decoded = JWT.decode(token_key, secret);
                                } catch (err) {
                                    check = false;
                                }

                                if (check == true) {
                                    //console.log(decoded);
                                    switch (queryName) {
                                        case 'stat':
                                            if (decoded.admin) {
                                                data = CONVERT.Convert_Revenue_Month_2_XML(revenueByMonth);
                                                data = new XMLSerializer().serializeToString(data);
                                            } else {
                                                data = CONVERT.Convert_Revenue_Staff_2_XML_Specific(revenue_staff_dict, decoded.user);
                                                data = new XMLSerializer().serializeToString(data);
                                            }
                                            break;
                                        case 'staff':
                                            if (decoded.admin) {
                                                data = CONVERT.Convert_Revenue_Staff_2_XML(revenue_staff_dict);
                                                data = new XMLSerializer().serializeToString(data);
                                            }
                                            break;
                                        case 'products':
                                            if (decoded.admin) {
                                                data = new XMLSerializer().serializeToString(CONVERT.Convert_2_Admin_Data(ALL_Books_XML, revenue_dict, viewed_data));
                                            } else {
                                                var permits = decoded.permit;

                                                var tmp = 0;

                                                for (var i = 0; i < permits.length; i++) {
                                                    switch (permits[i]) {
                                                        case "VN":
                                                            tmp = tmp | VN;
                                                            break;
                                                        case "EN":
                                                            tmp = tmp | EN;
                                                            break;
                                                    }
                                                }

                                                //console.log(tmp);
                                                switch (tmp) {
                                                    case VN:
                                                        data = new XMLSerializer().serializeToString(VN_Books_Sale_XML);
                                                        break;
                                                    case EN:
                                                        data = new XMLSerializer().serializeToString(EN_Books_Sale_XML);
                                                        break;
                                                    case ALL:
                                                        data = new XMLSerializer().serializeToString(ALL_Books_Sale_XML);
                                                        break;
                                                }
                                            }
                                            break;
                                    }
                                }
                            }

                            res.end(data);
                            break;
                        }

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
                        //console.log(auth);
                        var token = null;

                        try {
                            if (authencation_data[username].password == auth) {
                                token = JWT.encode({
                                    exp: Date.now() / 1000 + 3600,
                                    admin: authencation_data[username].admin,
                                    permit: authencation_data[username].permit,
                                    user: username
                                }, secret);
                            } else {
                                console.log("ERR");
                            }
                        } catch (err) {
                            token = null;
                        }

                        res.writeHeader(200, {
                            'Content-Type': 'text/plain'
                        });
                        res.end(token);
                        break;

                    case '/admin':
                        {
                            var token_key = req.headers.token;

                            var data = "";
                            try {
                                var decoded = JWT.decode(token_key, secret);
                                data = JSON.stringify(decoded);
                            } catch (err) {
                                //data = err.message;
                                console.log(err.message);
                            }

                            res.writeHeader(200, {
                                'Content-Type': 'text/json'
                            });
                            res.end(data);
                        }
                        break;

                    case '/sale':
                        {
                            var token_key = req.headers.token;

                            var data = "Thanh toán thành công";
                            try {
                                var decoded = JWT.decode(token_key, secret);

                                var permits = decoded.permit;
                                var username = decoded.user;

                                var tmp = 0;

                                for (var i = 0; i < permits.length; i++) {
                                    switch (permits[i]) {
                                        case "VN":
                                            tmp = tmp | VN;
                                            break;
                                        case "EN":
                                            tmp = tmp | EN;
                                            break;
                                    }
                                }

                                var VN_Books_XML_clone = new DOMParser().parseFromString(new XMLSerializer().serializeToString(VN_Books_XML));
                                var EN_Books_XML_clone = new DOMParser().parseFromString(new XMLSerializer().serializeToString(EN_Books_XML));

                                // Update data  
                                POST.Sale_Product(VN_Books_XML_clone, EN_Books_XML_clone, data_receive, tmp);

                                // If success then writing sale data to Sale_Staff_XML
                                UPDATE.Update_Sale_Staff(Sale_Staff_XML, revenue_staff_dict, data_receive, username);
                                POST.Save_Sale_Staff_XML(Sale_Staff_XML);

                                // Transfer
                                VN_Books_XML = VN_Books_XML_clone;
                                EN_Books_XML = EN_Books_XML_clone;

                                if (tmp & VN) {
                                    POST.Save_VN_Book_XML(VN_Books_XML);
                                    VN_Books_Sale_XML = CONVERT.Convert_2_Sale_XML(VN_Books_XML);
                                }
                                if (tmp & EN) {
                                    POST.Save_EN_Book_XML(EN_Books_XML);
                                    EN_Books_Sale_XML = CONVERT.Convert_2_Sale_XML(EN_Books_XML);
                                }

                                ALL_Books_Sale_XML = CONVERT.JOIN_2_Sale_XML(VN_Books_Sale_XML, EN_Books_Sale_XML);

                                // Update revenue_dict and revenue by month
                                UPDATE.Update_Revenue_Dict(revenue_dict, data_receive);
                                sortByRevenue = HANDLE_DATA.Get_Top_10_Revenue(revenue_dict);
                                revenueByMonth = HANDLE_DATA.List_Revenue_By_Month_Year(VN_Books_XML, EN_Books_XML, new Date().getFullYear());
                                //
                            } catch (err) {
                                data = err.message;
                                console.log(err.message);
                                console.log(err.stack);
                            }

                            res.writeHeader(200, {
                                'Content-Type': 'text/xml'
                            });
                            res.end(`<Ket_qua mess="${data}"></Ket_qua>`);
                        }
                        break;

                    case '/delete-product':
                        {
                            var dataXML = new DOMParser().parseFromString(data_receive);
                            var SKU = dataXML.getElementsByTagName("Xoa")[0].getAttribute("SKU");

                            var data = "Xoá thành công";

                            try {
                                var lang = HANDLE_DATA.Delete_Book(VN_Books_XML, EN_Books_XML, SKU);
                                ALL_Books_XML = CONVERT.JOIN_2_XML(VN_Books_XML, EN_Books_XML);

                                // Save VN_Books and EN_Books
                                switch (lang) {
                                    case 'VN':
                                        POST.Save_VN_Book_XML(VN_Books_XML);
                                        VN_Books_XML_Little = CONVERT.Convert_2_Little_XML(VN_Books_XML);
                                        break;
                                    case 'EN':
                                        POST.Save_EN_Book_XML(EN_Books_XML);
                                        EN_Books_XML_Little = CONVERT.Convert_2_Little_XML(EN_Books_XML);
                                        break;
                                }

                                ALL_Books_XML_Little = CONVERT.JOIN_2_XML_Little(VN_Books_XML_Little, EN_Books_XML_Little);
                                delete viewed_data[SKU];
                                delete revenue_dict[SKU];
                            } catch (err) {
                                data = err.message;
                                console.log(err.message);
                            }

                            res.writeHeader(200, {
                                'Content-Type': 'text/xml'
                            });
                            res.end(`<Ket_qua mess="${data}"></Ket_qua>`);
                        }
                        break;

                    case '/add-product':
                        {
                            var dataXML = new DOMParser().parseFromString(data_receive);
                            var book = dataXML.getElementsByTagName("Them_sach")[0];
                            var lang = book.getAttribute("lang");
                            var SKU = book.getAttribute("SKU");

                            var data = "";
                            if (HANDLE_DATA.Check_SKU_Exist(ALL_Books_XML_Little, SKU)) {
                                data = "Mã sách đã tồn tại";
                            } else {
                                data = "Thêm thành công";

                                try {
                                    switch (lang) {
                                        case 'VN':
                                            HANDLE_DATA.Add_Book(VN_Books_XML, book);
                                            POST.Save_VN_Book_XML(VN_Books_XML);
                                            VN_Books_XML_Little = CONVERT.Convert_2_Little_XML(VN_Books_XML);
                                            break;
                                        case 'EN':
                                            HANDLE_DATA.Add_Book(EN_Books_XML, book);
                                            POST.Save_EN_Book_XML(EN_Books_XML);
                                            EN_Books_XML_Little = CONVERT.Convert_2_Little_XML(EN_Books_XML);
                                            break;
                                    }

                                    ALL_Books_XML_Little = CONVERT.JOIN_2_XML_Little(VN_Books_XML_Little, EN_Books_XML_Little);
                                    ALL_Books_XML = CONVERT.JOIN_2_XML(VN_Books_XML, EN_Books_XML);

                                    viewed_data[SKU] = 0;
                                    revenue_dict[SKU] = 0;
                                } catch (err) {
                                    data = err.message;
                                    console.log(err.message);
                                }
                            }

                            res.writeHeader(200, {
                                'Content-Type': 'text/xml'
                            });
                            res.end(`<Ket_qua mess="${data}"></Ket_qua>`);
                        }
                        break;

                    case '/edit-product':
                        {
                            var dataXML = new DOMParser().parseFromString(data_receive);
                            var book = dataXML.getElementsByTagName("Sua_sach")[0];
                            var SKU = book.getAttribute("SKU");

                            var data = "";
                            if (HANDLE_DATA.Check_SKU_Exist(ALL_Books_XML_Little, SKU)) {
                                data = "Chỉnh sửa thành công";

                                try {
                                    var lang = HANDLE_DATA.Edit_Book(VN_Books_XML, EN_Books_XML, book);

                                    switch (lang) {
                                        case 'VN':
                                            POST.Save_VN_Book_XML(VN_Books_XML);
                                            VN_Books_XML_Little = CONVERT.Convert_2_Little_XML(VN_Books_XML);
                                            break;
                                        case 'EN':
                                            POST.Save_EN_Book_XML(EN_Books_XML);
                                            EN_Books_XML_Little = CONVERT.Convert_2_Little_XML(EN_Books_XML);
                                            break;
                                    }

                                    ALL_Books_XML_Little = CONVERT.JOIN_2_XML_Little(VN_Books_XML_Little, EN_Books_XML_Little);
                                    ALL_Books_XML = CONVERT.JOIN_2_XML(VN_Books_XML, EN_Books_XML);
                                } catch (err) {
                                    data = err.message;
                                    console.log(err.message);
                                    console.log(err.stack);
                                }
                            } else {
                                data = "Mã SKU không tồn tại";
                            }

                            res.writeHeader(200, {
                                'Content-Type': 'text/xml'
                            });
                            res.end(`<Ket_qua mess="${data}"></Ket_qua>`);
                        }
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
                res.writeHeader(404, {
                    'Content-Type': 'text/plain'
                });
                res.end("Request was not support!!!");
                break;
        }
    });
}).listen(PORT, (err) => {
    if (err != null)
        console.log('==> Error: ' + err);
    else
        console.log('Data server is starting at port ' + PORT);
});