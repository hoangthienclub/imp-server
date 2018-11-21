var Q = require("q");
var express = require('express');
var router = express.Router();
var systemService = require('../../services/api/system.service');
var searchService = require('../../services/search.service');
var langService = require("../../services/lang.service");
var GenerateUrl = require("../../utils/url.util").GenerateURL;
const collectionConst = require("../../utils/system.const").COLLECTION;
var siteService = require("../../services/site.service");
var langService = require("../../services/lang.service");
var companyService = require("../../services/company.service");
var MyRender = require("../__render.controller");
var GenerateUrl = require("../../utils/url.util").GenerateURL;
/**
 * Điều hướng tất cả request vào 1 middle ware để kiểm tra trước khi thực hiện request
 */
router.use(HandleController)


function getFilterId(filter, type) {
    if (!Array.isArray(filter[type])) {
        return undefined;
    }
    return {
        "$nin": filter[type]
    }
}

router.get('/filter', function (req, res) {
    let filter = req.query.filter ? req.query.filter : {};
    let lang = req.language;
    Q.all([
        systemService.getList(collectionConst.COMPANYCATEGORIES, {textQuery: req.query.q, _id: getFilterId(filter, collectionConst.COMPANYCATEGORIES), groupId: "5b062e32dc9753105c38da55"}, lang, 3, {}, {_id: 1}),
        systemService.getList(collectionConst.INDUSTRIALPARKS, {textQuery: req.query.q, _id: getFilterId(filter, collectionConst.INDUSTRIALPARKS)}, lang, 3, {}, {_id: 1}),
        systemService.getList(collectionConst.MAPPROVINCES, {textQuery: req.query.q, _id: getFilterId(filter, collectionConst.MAPPROVINCES)}, lang, 3, {}, {_id: 1}),
        systemService.getList(collectionConst.MAPDISTRICTS, {textQuery: req.query.q, _id: getFilterId(filter, collectionConst.MAPDISTRICTS)}, lang, 3, {}, {_id: 1})
    ])
        .then(function (arr) {
            let data = []
            let types = [{
                attr: collectionConst.COMPANYCATEGORIES,
                name: "Category"
            }, {
                attr: collectionConst.INDUSTRIALPARKS,
                name: "Industrial Park"
            }, {
                attr: collectionConst.MAPPROVINCES,
                name: "Province"
            }, {
                attr: collectionConst.MAPDISTRICTS,
                name: "District"
            }];
            
            for (let idx in types) {
                if (Array.isArray(arr[idx].rows)) {
                    data.push({
                        text: types[idx].name,
                        children: arr[idx].rows.map(e => { return {
                            id: e._id,
                            type: types[idx].attr,
                            text: e.name
                        }; })
                    })
                }
            }
            res.json(data);
        })
        .catch(err => console.log(err));
})

router.post('/init-filter', function (req, res) {
    let filter = req.body ? req.body : {};
    let lang = req.language;
    Q.all([
        systemService.getList(collectionConst.COMPANYCATEGORIES, {_id: [].concat(filter[collectionConst.COMPANYCATEGORIES]), groupId: "5b062e32dc9753105c38da55"}, lang, 100),
        systemService.getList(collectionConst.INDUSTRIALPARKS, {_id: [].concat(filter[collectionConst.INDUSTRIALPARKS])}, lang, 100),
        systemService.getList(collectionConst.MAPPROVINCES, {_id: [].concat(filter[collectionConst.MAPPROVINCES])}, lang, 100),
        systemService.getList(collectionConst.MAPDISTRICTS, {_id: [].concat(filter[collectionConst.MAPDISTRICTS])}, lang, 100)
    ]).then(function (arr) {
        let types = [collectionConst.COMPANYCATEGORIES, collectionConst.INDUSTRIALPARKS, collectionConst.MAPPROVINCES, collectionConst.MAPDISTRICTS];
        res.json(arr.map((e, i) => e.rows.map(f => { return {id: f._id, text: f.name, type: types[i]}; })));
    }).catch(err => console.log(err));
})

router.post('/company-name', function (req, res) {
    let lang = req.language;
    if (Array.isArray(req.body._id)) {
        systemService.getCompanyNames(req.body._id, lang)
            .then((arr) => {
                res.json(arr);
            })
            .catch((err) => {
                res.json(err);
            })
    } else {
        res.json([]);
    }
})

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

router.post("/home/category", function (req, res) {
    systemService.getCompanyCategory(req.platform, req.body.page, req.language)
        .then(function (pageData) {
            pageData.rows = pageData.rows.map(function (e) {
                if (e.imageId && e.imageId.url) {
                    return {name: e.name, imageUrl: e.imageId.url + "?w=45&h=45&fit=crop", url: e.url, total: e.total, _id: e._id};
                } else {
                    return {name: e.name, imageUrl: "public/assets/legal-struture.svg", total: e.total, _id: e._id};
                }
            })
            res.json({
                rows: pageData.rows,
                currentPage: parseInt(req.body.page),
                showLoadMore: req.body.page * 5 < pageData.total ? true : false
            });
        })
        .catch(function(err) {
            res.status(510).send(err);
        })
})
router.post("/action/:action", function (req, res) {
    let data = req.body;
    let action = "post" + capitalizeFirstLetter(req.params.action);
    data.uuid = req.uuid;
    
    if (typeof siteService[action] == "function") {
        siteService[action](data)
            .then(function () {
                promises = [langService.getViewLang(["modals/" + req.params.action + "/success"], req.language)]
                Q.all(promises)
                    .then(function (arr) {
                        res.render(req.platform + "modals/success", {langData: arr[0]})
                    })
                    .catch(function (err) {
                        res.status(510).send(err);
                    })
            })
            .catch(function(err) {
                promises = [langService.getViewLang(["modals/" + req.params.action + "/fail"], req.language)]
                Q.all(promises)
                    .then(function (arr) {
                        res.render(req.platform + "modals/fail", { langData: arr[0], key: err })
                    })
                    .catch(function (_err) {
                        res.status(510).send(_err);
                    })
            })
    } else {
        res.status(404).end();
    }
})
router.post("/cookie", function (req, res) {
    siteService.postCookie({uuid: req.uuid})
        .then(function () {
            res.status(200).end();
        })
        .catch(function(err) {
            res.status(510).send(err);
        })
})

router.post("/cookie_downloada_app", function (req, res) {
    siteService.postCookieDownloadApp({uuid: req.uuid})
        .then(function () {
            res.status(200).end();
        })
        .catch(function(err) {
            res.status(510).send(err);
        })
})
router.post("/location/filter", function (req, res, next) {
    let deferred = Q.defer();
    let promises = [];
    promises.push(langService.getViewLang(["partials/filter"], req.language))
    for (let attr in req.body) {
        let ids = Object.keys(req.body[attr]);
        promises.push(systemService.getList(attr, {_id: ids}, req.language, 1000))
    }
    Q.all(promises)
        .then(function (arr) {
            let filter = {};
            let i = 1;
            for (let attr in req.body) {
                filter[attr] = arr[i++];
            }
            res.render(req.platform + "partials/filter", {filter: filter, receive: req.body, langData: arr[0]});
        })
        .catch(function(err) {
            res.status(510).send(err);
        })
    return deferred.promise;
})
router.post("/geometry/province", function (req, res) {
    systemService.getProvinceGeometry(req.language)
        .then(function (data) {
            res.json(data);
        })
        .catch(function(err) {
            res.status(510).send(err);
        })
})
router.post("/geometry/ip", function (req, res) {
    systemService.getIndustrialParkGeometry(req.language)
        .then(function (data) {
            res.json(data);
        })
        .catch(function(err) {
            res.status(510).send(err);
        })
})

router.post("/province/popup", function (req, res) {
    let deferred = Q.defer();
    let promises = [];
    promises.push(langService.getViewLang(["partials/province-popup"], req.language))
    promises.push( systemService.getProvinceInfoPopup(req.body.id, req.language))
    Q.all(promises)
        .then(function (arr) {
            res.render(req.platform + "partials/province-popup", {row: arr[1], genUrl: GenerateUrl(req.language), langData: arr[0]}, function (err, html) {
                if (err) {
                    console.log(err);
                    res.end();
                } else {
                    res.send(html);
                }
            })
        })
        .catch(function(err) {
            res.status(510).send(err);
        })
    return deferred.promise;
})

router.post("/industrialPark/popup", function (req, res) {
    let deferred = Q.defer();
    let promises = [];
    promises.push(langService.getViewLang(["partials/ip-popup"], req.language))
    promises.push( systemService.getIndustrialParkInfoPopup(req.body.id, req.language))
    Q.all(promises)
        .then(function (arr) {
            res.render(req.platform + "partials/ip-popup", {row: arr[1], genUrl: GenerateUrl(req.language), langData: arr[0]}, function (err, html) {
                if (err) {
                    console.log(err);
                    res.end();
                } else {
                    res.send(html);
                }
            })
        })
        .catch(function(err) {
            res.status(510).send(err);
        })
    return deferred.promise;
})

/**
 * Route dùng cho map phiên bản cũ
 */
router.post("/companies/latLng", function (req, res) {
    systemService.getCompanyLocation()
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
            res.status(510).send(err);
        })
})
router.post("/companies/info", function (req, res) {
    systemService.getCompanyInfo(req.body._id)
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
            res.status(510).send(err);
        })
})
router.post("/company/search", function (req, res) {
    searchService.storeQuery(req.uuid, req.body.query);
    searchService.search(req.body.query)
        .then(function (arr) {
            res.json(arr);
        })
        .catch(function(err) {
            res.status(510).send(err);
        })
})
router.post("/company/popup", function (req, res) {
    systemService.getCompanyInfo(req.body.id, req.language)
        .then(function (company) {
            res.render(req.platform + "partials/company-popup", {company: company, genUrl: GenerateUrl(req.language)}, function (err, html) {
                if (err) {
                    console.log(err);
                    res.end();
                } else {
                    res.send(html);
                }
            })
        })
        .catch(function(err) {
            console.log(err);
            res.status(510).send(err);
        })
})
router.post("/company/list-popup", function (req, res) {
    systemService.getListCompanyInfos(req.body.ids, req.language)
        .then(function (companies) {
            res.render(req.platform + "partials/list-company-popup", {companies: companies, genUrl: GenerateUrl(req.language)}, function (err, html) {
                if (err) {
                    console.log(err);
                    res.end();
                } else {
                    res.send(html);
                }
            })
        })
        .catch(function(err) {
            console.log(err);
            res.status(510).send(err);
        })
})
router.post("/company/viewbox", function (req, res) {
    let ids = [];
    try {
        ids = JSON.parse(req.body.ids);
    } catch (ex) {};
    
    systemService.getViewBox(ids, req.language)
        .then(function (obj) {
            obj.rows.sort(function(a, b){  
                return ids.indexOf(a._id.toString()) - ids.indexOf(b._id.toString());
            });
            MyRender(req, res, "partials/company-viewbox", {rows: obj.rows, genUrl: GenerateUrl(req.language)});
        })
        .catch(function(err) {
            console.log(err);
            res.status(510).send(err);
        })
})

router.post("/company/locations", function (req, res) {
    systemService.getCompanyLocation(req.language)
        .then(function (data) {
            res.json(data);
        })
        .catch(function(err) {
            res.status(510).send(err);
        })
})

router.post("/company/suggest-search", function (req, res) {
    systemService.getListSearch({companies: collectionConst.COMPANIES, codeVns: collectionConst.CODEVNS, codeSics: collectionConst.CODESICS, codeNaics: collectionConst.CODENAICS, companyCategories: collectionConst.COMPANYCATEGORIES}, req.body.query, req.language)
        .then(function (data) {
            if(data.companies.total == 0 && data.codeVns.total == 0 && data.codeSics.total == 0 && data.codeNaics.total == 0 && data.companyCategories.total == 0) {
                if (req.platform == "json/") {
                    res.send(data);
                } else {
                    res.send(`
                        <div>Khong co ket qua trung khop</div>
                    `);
                }
            } else {
                promises = [langService.getViewLang(["modals/suggestSearch"], req.language)]
                Q.all(promises)
                    .then(function (arr) {
                        res.render(req.platform + "partials/suggest-search", {data: data, genUrl: GenerateUrl(req.lang), keySearch: data.keySearch, lang: arr[0]}, function (err, html) {
                            if (err) {
                                console.log(err);
                                res.end();
                            } else {
                                if (req.platform == "json/") {
                                    res.setHeader('Content-Type', 'application/json');
                                }
                                res.send(html);
                            }
                        })
                    })
                    .catch(function (err) {
                        res.status(510).send(err);
                    })
            }
        })
        .catch(function(err) {
            console.log(err);
            res.status(510).send(err);
        })
})

router.get("/company/getListCompanySampleData", function (req, res) {
    systemService.getListNameCompany({textQuery: req.query.key}, req.language)
        .then(function (data) {
            res.send(data);
        })
        .catch(function(err) {
            console.log(err);
            res.status(510).send(err);
        })
})


router.get("/company/getListCompanyPositionSampleData", function (req, res) {
    systemService.getListNamePosition({textQuery: req.query.key}, req.language)
        .then(function (data) {
            if (data.length - 1 > 0) {
                data.splice(data.length - 1, 1);
            }
            res.send(data);
        })
        .catch(function(err) {
            console.log(err);
            res.status(510).send(err);
        })
})

/**
 * Route dùng cho map với lượng marker lớn
 */
router.get('/search',   SearchController)
router.get('/viewbox',  ViewboxController)


/**
 * Route API cho hệ thống
 */
router.post("/:module/count",   CountController);
router.post("/:module/getOne",  GetOneController);
router.get("/:module/getById/:_id", GetByIdController);
router.post("/:module/getByUrl", GetByUrlController);
router.post("/:module/getList", GetListController);



/**
 * Đón tất cả các request và kiểm tra tính hợp lệ của request
 * Tùy thuộc vào định nghĩa bên trong của HandleController
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
function HandleController (req, res, next) {
    next();
}


/**
 * Đếm số lượng document phù hợp với tham số nằm trong req.body
 * Tham số req.params.module quyết định collection được truy vấn
 * @param {Request} req 
 * @param {Response} res 
 */
function CountController (req, res) {
    systemService.count(req.params.module, req.body)
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
            res.status(510).send(err);
        })
}

/**
 * Lấy về document với tham số nằm trong req.body
 * Tham số req.params.module quyết định collection được truy vấn
 * @param {Request} req 
 * @param {Response} res 
 */
function GetOneController (req, res) {
    systemService.getOne(req.params.module, req.body, req.language)
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
            res.status(510).send(err);
        })
}

/**
 * Lấy về document với tham số req.params._id
 * Tham số req.params.module quyết định collection được truy vấn
 * @param {Request} req 
 * @param {Response} res 
 */
function GetByIdController (req, res) {
    systemService.getById(req.params.module, req.params._id, req.language)
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
            res.status(510).send(err);
        })
}

/**
 * Lấy về document với tham số truyền vào là url trong body nếu collection được tổ chức lưu url
 * Tham số req.params.module quyết định collection được truy vấn
 * Các điều kiện khác được lưu trong body
 * @param {Request} req 
 * @param {Response} res 
 */
function GetByUrlController(req, res) {
    systemService.getByUrl(req.params.module, req.body.url, req.language)
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
            res.status(510).send(err);
        })
}


/**
 * Lấy danh sách document theo tham số page trong body
 * Tham số req.params.module quyết định collection được truy vấn
 * Các điều kiện khác được lưu trong body
 * @param {Request} req 
 * @param {Response} res 
 */
function GetListController (req, res) {
    systemService.getList(req.params.module, req.body, req.language)
        .then(function (data) {
            console.log(data)
            res.json(data);
        })
        .catch(function (err) {
            res.status(510).send(err);
        })
}



/**
 * Tìm kiếm các doanh nghiệp phù hợp với điều kiện filter của người dùng
 * Tham số req.params.module quyết định collection được truy vấn
 * Thể hiện dưới dạng marker của google map
 * @param {Request} req 
 * @param {Response} res 
 */
function SearchController (req, res) {
    let params = {};
    let clientType = "10K";
    if (["10K", "700K"].indexOf(req.query.clientType) >= 0) {
        clientType = req.query.clientType;
    }
    for (let e of [collectionConst.INDUSTRIALPARKS, collectionConst.COMPANYCATEGORIES, collectionConst.CODESICS, collectionConst.CODEVNS, collectionConst.CODENAICS, collectionConst.MAPPROVINCES, collectionConst.MAPDISTRICTS]) if (req.query[e]) params[e] = req.query[e];
    searchService.search({
        text: req.query.text || "", 
        zoom: req.query.zoom ? parseInt(req.query.zoom) : 6, 
        bb_string: req.query.bb_string ? req.query.bb_string : "98.63525390625,10.18518740926906,117.66357421875001,21.739091217718574",
        params: params
    }, clientType)
        .then(data => {
            res.json(data);
        })
        .catch(err => res.json(err));
}


/**
 * Tìm kiếm các doanh nghiệp phù hợp với điều kiện filter của người dùng
 * Tham số req.params.module quyết định collection được truy vấn
 * Thể hiện dưới dạng html cho web, tham số req.query.type là json sẽ trả về dạng json
 * @param {Request} req 
 * @param {Response} res 
 */
function ViewboxController (req, res) {
    let params = {};
    let searchData = undefined;
    let clientType = "10K";
    if (["10K", "700K"].indexOf(req.query.clientType) >= 0) {
        clientType = req.query.clientType;
    }
    for (let e of [collectionConst.INDUSTRIALPARKS, collectionConst.COMPANYCATEGORIES, collectionConst.CODESICS, collectionConst.CODEVNS, collectionConst.CODENAICS, collectionConst.MAPPROVINCES, collectionConst.MAPDISTRICTS]) if (req.query[e]) params[e] = req.query[e];
    searchService.viewbox({
        text: req.query.text || "",
        zoom: req.query.zoom ? parseInt(req.query.zoom) : 6, 
        bb_string: req.query.bb_string ? req.query.bb_string : "98.63525390625,10.18518740926906,117.66357421875001,21.739091217718574",
        page: parseInt(req.query.page) || 0, 
        params: params
    }, clientType)
        .then(data => {
            searchData = data;
            return systemService.getViewBox(data.current_ids, req.language);
        })
        .then((obj) => {
            obj.rows.sort(function(a, b){  
                return searchData.current_ids.indexOf(a._id.toString()) - searchData.current_ids.indexOf(b._id.toString());
            });
            langService.getViewLang(["partials/company-viewbox"], req.language)
                .then(function (langData) {
                    res.render(req.platform + "partials/company-viewbox", {
                        pageData: obj, 
                        genUrl: GenerateUrl(req.language),
                        langData: langData
                    }, function (err, html) {
                        if (req.platform == "json/") {
                            delete searchData.current_ids;
                            searchData.data = JSON.parse(html);
                        } else {
                            searchData.data = html;
                        }
                        res.json(searchData);
                    })
                })
                .catch(function (err) {
                    console.log(err);
                    res.status(510).send(err);
                })
                
        })
        .catch(function (err) {
            console.log(err);
            res.status(510).send(err);
        })
}

module.exports = router;