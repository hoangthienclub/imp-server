var Q = require('q');
var _ = require('lodash');
var express = require('express');
var router = express.Router();
var systemService = require('../services/api/system.service');
var searchService = require('../services/search.service');
var langService = require("../services/lang.service");
var GenerateUrl = require("../utils/url.util").GenerateURL;
const collectionConst = require("../utils/system.const").COLLECTION;


router.get("/province/:query?", ViewProvinces);
router.get("/industrial-park/:query?", ViewIPs);
router.get("/association/:query?", ViewAssociations);
/**
 * Lấy về viewbox của industrial park trong trang map. Dữ liệu trả về theo từng { page } được truyển 
 * vào thông qua url params. Giá trị page mặc định là 0.
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
function ViewIPs(req, res, next) {
    let lang = req.language;
    let ips = [];
    let page = req.query.page || 0;
    let textQuery = req.params.query || "";
    let totalPage = 0;
    let total = 0;
    Q.all([
        systemService.getList(collectionConst.INDUSTRIALPARKS, {page: page, textQuery: textQuery}, lang),
        langService.getViewLang(["partials/ip-viewbox"], lang)
    ])
    .then(function (arr) {
        ips = arr[0].rows;
        total = arr[0].total;
        totalPage = arr[0].totalPage;

        res.render(req.platform + "partials/ip-viewbox", {
            total: total,
            page: page,
            ips: ips,
            totalPage: totalPage,
            genUrl: GenerateUrl(lang),
            langData: arr[1]
        }, function (err, html) {
            res.setHeader('Content-Type', 'application/json');
            res.send(html);
        })
    })
    .catch(function(err) {
        res.status(510).send(err);
    })
}

/**
 * Lấy về viewbox của Association trong trang map. Dữ liệu trả về theo từng { page } được truyển 
 * vào thông qua url params. Giá trị page mặc định là 0.
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
function ViewAssociations(req, res, next) {
    let lang = req.language;
    let associations = [];
    let page = req.query.page || 0;
    let textQuery = req.params.query || "";
    let total = 0;
    let totalPage = 0;
    Q.all([
        systemService.getList(collectionConst.ASSOCIATIONS, {page: page, textQuery: textQuery}, lang)
    ]).then(function(arr) {
        associations = arr[0].rows;
        total = arr[0].total;
        totalPage = arr[0].totalPage;
        
        return Q.all([
            systemService.counts(collectionConst.COMPANIES, "associationId", {}, {
                "associationId": {
                    "$in": associations.map(e => e._id)
                }
            })
        ]);
    })
    .then(function (arr) {
        for (let i = 0; i < associations.length; i += 1) {
            associations[i].totalCompany = arr[0][associations[i]._id];
        }
        res.render(req.platform + "partials/association-viewbox", {
            associations: associations,
            total: total,
            page: page,
            totalPage: totalPage
        }, function (err, html) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.send(html);
        })
    })
    .catch(function(err) {
        console.log(err);
        res.status(510).send(err);
    })
}

/**
 * Lấy về viewbox của province trong trang map. Dữ liệu trả về theo từng { page } được truyển 
 * vào thông qua url params. Giá trị page mặc định là 0
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
function ViewProvinces(req, res, next) {
    let lang = req.language;
    let provinces = [];
    let page = req.query.page || 0;
    let textQuery = req.params.query || "";
    let total = 0;
    let totalPage = 0;
    Q.all([
        systemService.getList(collectionConst.PROVINCECITIES, {page: page, textQuery: textQuery}, lang)
    ]).then(function(arr) {
        provinces = arr[0].rows;
        total = arr[0].total;
        totalPage = arr[0].totalPage;

        return Q.all([
            systemService.counts(collectionConst.COMPANIES, "address.provinceId", {}, {
                "address.provinceId": {
                    "$in": provinces.map(e => e.provinceId[0])
                }
            }),
            systemService.counts(collectionConst.INDUSTRIALPARKS, "address.provinceId", {}, {
                "address.provinceId": {
                    "$in": provinces.map(e => e.provinceId[0])
                }
            }),
            langService.getViewLang(["partials/province-viewbox"], lang)
        ]);
    })
    .then(function (arr) {
        for (let i = 0; i < provinces.length; i += 1) {
            provinces[i].totalCompany = arr[0][provinces[i].provinceId[0]];
            provinces[i].totalIP = arr[1][provinces[i].provinceId[0]];
        }
        res.render(req.platform + "partials/province-viewbox", {
            provinces: provinces,
            total: total,
            page: page,
            totalPage: totalPage,
            genUrl: GenerateUrl(lang),
            langData: arr[2]
        }, function (err, html) {
            res.setHeader('Content-Type', 'application/json');
            res.send(html);
        })
    })
    .catch(function(err) {
        console.log(err);
        res.status(510).send(err);
    })
}
module.exports = router;