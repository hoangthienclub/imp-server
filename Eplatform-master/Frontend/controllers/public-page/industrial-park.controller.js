var systemService = require("../../services/api/system.service");
var MyRender = require("../__render.controller");
var Q = require("q");
const collectionConst = require("../../utils/system.const").COLLECTION;
var config = require('../../config.json');
const typeCast = require("../../utils/type.cast");
const treeMenu = require("../../utils/url.util").treeMenu;

function getCompany(industrialParkId, lang) {
    var deferred = Q.defer();

    let promises = [
        systemService.getList(collectionConst.COMPANIES, {}, lang, 12, { "industrialParkId.id" : typeCast.castObjectId(industrialParkId) })   
    ]
    Q.all (promises)
        .then (function(arr) {
            let promises2 = [];
            for (let e of arr[0].rows) {
                promises2.push(systemService.getList(collectionConst.COMPANYCATEGORIES, {_id: e.companyCategoryId}, lang, undefined, {groupId: typeCast.castObjectId("5b062e32dc9753105c38da55")})),
                promises2.push(systemService.getOne(collectionConst.MAPPROVINCES, {}, lang, {_id: e.address.provinceId}))
            }
            Q.all(promises2)
                .then(function (data) {
                    for (let e in arr[0].rows) {
                        arr[0].rows[e].categories = data[2 * e].rows;
                        arr[0].rows[e].provinceData = data[2 * e + 1];
                    }
                    deferred.resolve(arr[0]);
                })
                .catch(function (err) {
                    deferred.reject(err);
                })
        })
        .catch (function(err) {
            console.log(err);
            deferred.reject([])
        })
    
    return deferred.promise;
}

function getIndustrialParkData(url, lang) {
    var deferred = Q.defer();
    var data = {};

    let promises = [
        systemService.getByUrl(collectionConst.INDUSTRIALPARKS, url, lang)
    ]
    Q.all (promises)
        .then (function(arr) {
            data = arr[0];
            let promises2 = [
                getCompany(arr[0]._id, lang),
                systemService.getList(collectionConst.COMPANYNEWS, {}, lang, undefined, { "industrialParkId.id" : typeCast.castObjectId(arr[0]._id) }),
                systemService.getOne(collectionConst.PROVINCECITIES, {}, lang, {"provinceId" : arr[0].address.provinceId}),
                systemService.getOne(collectionConst.MAPDISTRICTS, {}, lang, { "_id" : arr[0].address.districtId }),
                systemService.count(collectionConst.COMPANIES, {}, { "industrialParkId.id" : typeCast.castObjectId(arr[0]._id) }),
                systemService.getList(collectionConst.INDUSTRIALPARKS, {}, lang, undefined, {"address.provinceId" : arr[0].address.provinceId})
            ]
            Q.all(promises2)
                .then (function(array) {
                    data.companyData = array[0].rows;
                    data.newsData = array[1].rows;
                    data.provinceData = array[2];
                    data.districtData = array[3];
                    data.totalCompany = array[4].total;
                    data.relatedIpData = array[5].rows;
                    deferred.resolve(data);
                })
                .catch (function(err) {
                    console.log("#", err);
                    deferred.reject([])
                })
        })
        .catch (function (err) {
            console.log(err);
        })

    return deferred.promise;
}

function Controller (req, res, next) {
    let url = "";
    for (lang of config.langs) {
        try {
            url = req.path.match(treeMenu.industrialPark[lang].regex)[treeMenu.industrialPark[lang].param.url];
            break;
        } catch (ex) {};
    }

    let promises = [
        getIndustrialParkData(url, req.language)
    ]
    Q.all (promises)
        .then(function (obj) {
            MyRender(req, res, "industrial-park", obj[0]);
        })
        .catch(function(err){
            console.log(err);
            next();
        })
}
module.exports = { GET: Controller };