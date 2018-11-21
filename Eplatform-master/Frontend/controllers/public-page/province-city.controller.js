var systemService = require("../../services/api/system.service");
var MyRender = require("../__render.controller");
var Q = require("q");
const collectionConst = require("../../utils/system.const").COLLECTION;
var config = require('../../config.json');
const typeCast = require("../../utils/type.cast");
const treeMenu = require("../../utils/url.util").treeMenu;
var request = require('request');

function getCompany(provinceCityId, lang) {
    var deferred = Q.defer();
    let promises = [
        systemService.getList(collectionConst.COMPANIES, {}, lang, 12, { "address.provinceId" : typeCast.castObjectId(provinceCityId) })   
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

function getProvinceCityData(url, lang) {
    var deferred = Q.defer();
    var data = {};

    let promises = [
        systemService.getByUrl(collectionConst.PROVINCECITIES, url, lang)
    ]
    Q.all (promises)
        .then (function(arr) {
            data = arr[0];
            request.get({
                url: "http://vietnampropertyhub.vn/map/property/" + arr[0].provinceId[0],
                json: true
            }, function (error, response, body) {
                let promises2 = [
                    getCompany(arr[0].provinceId[0], lang),
                    systemService.getList(collectionConst.COMPANYNEWS, {}, lang, undefined, { "provinceCityId.id" : typeCast.castObjectId(arr[0]._id) }),
                    systemService.getList(collectionConst.INDUSTRIALPARKS, {}, lang, 10, { "address.provinceId" : typeCast.castObjectId(arr[0].provinceId[0]) }),
                    systemService.getOne(collectionConst.MAPPROVINCES, {}, lang, { "_id" : typeCast.castObjectId(arr[0].provinceId[0])}, true),
                    systemService.count(collectionConst.COMPANIES, {}, { "address.provinceId" : typeCast.castObjectId(arr[0].provinceId[0]) }),
                    systemService.count(collectionConst.INDUSTRIALPARKS, {}, { "address.provinceId" : typeCast.castObjectId(arr[0].provinceId[0]) }),
                    systemService.getOne(collectionConst.MAPREGIONS, {}, lang, { "oldId" : arr[0].Region }),
                ] 
                Q.all(promises2)
                    .then (function(array) {
                        data.companyData = array[0].rows;
                        data.newsData = array[1].rows;
                        data.ipData = array[2].rows;
                        data.geometryProvince = array[3].geometry.coordinates;
                        data.totalCompany = array[4].total;
                        data.totalIP = array[5].total;
                        data.regionName = array[6].name;
                        if (body[0].length > 0) {
                            body[0].forEach(element => {
                                if (element.tenure && element.tenure.lease == true)
                                    element.purpose = "For Lease";
                                else if (element.tenure && element.tenure.sale == true)
                                    element.purpose = "For Sale";
                            });
                        }
                        data.propertyList = body[0];
                        deferred.resolve(data);
                    })
                    .catch (function(err) {
                        deferred.reject([])
                    })
            });
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
            url = req.path.match(treeMenu.provinceCity[lang].regex)[treeMenu.provinceCity[lang].param.url];
            break;
        } catch (ex) {};
    }

    let promises = [
        getProvinceCityData(url, req.language)
    ]
    Q.all (promises)
        .then(function (obj) {
            MyRender(req, res, "province-city", obj[0]);
        })
        .catch(function(err){
            console.log(err);
            next();
        })
}
module.exports = { GET: Controller };