var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
var config = require('../../config.json');
var db = mongo.db(config.connectionString, { native_parser: true });
let moduleCfgs = require("../../modules/config").modules;
var collectionConst = require("../../utils/system.const").COLLECTION;
let modules = {};
for (let moduleCfg in moduleCfgs) {
    db.bind(moduleCfgs[moduleCfg].collection);

    modules[moduleCfgs[moduleCfg].collection] = {
        fields: moduleCfgs[moduleCfg].fields,
        maps: moduleCfgs[moduleCfg].fields.filter(function (e) {
            return ["map"].indexOf(e.inputType) >= 0;
        })
    };
}


var service = {};
service.count = count;
service.chart = chart;


function count(collection, condition = {}) {
    let deferred = Q.defer();
    if (db[collection] === undefined) {
        deferred.reject("Unknow collection");
        return deferred.promise;
    }

    if (condition.isDelete != undefined) {
        condition.isDelete = false;
    }
    db[collection].count(condition, function (err, count) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(count);
        }
    })

    return deferred.promise;
}

function chart(collection, condition = {}) {
    let deferred = Q.defer();
    if (db[collection] === undefined) {
        deferred.reject("Unknow collection");
        return deferred.promise;
    }

    if (condition.isDelete === undefined) {
        condition.isDelete = false;
    }
    if (modules[collection].maps.length == 0) {
        deferred.reject("Collection dont have map data");
        return deferred.promise;
    }
    
    db[collection].aggregate([
        {
            "$match": condition
        }, {
            "$project": {
                "_id": "$_id",
                "map": "$" + modules[collection].maps[0].attr + ".provinceId"
            }
        }, {
            "$group": {
                "_id": "$map",
                "total": {
                    "$sum": 1
                }
            }
        }, {
            "$sort": {
                "total": -1
            }
        }, {
            "$lookup": {
                "from": collectionConst.MAPPROVINCES,
                "localField": "_id",
                "foreignField": "_id",
                "as": "province"
            }
        }, {
            "$unwind": "$province"
        }, {
            "$project": {
                "total": "$total",
                "nameId": "$province.data.en"
            }
        }, {
            "$lookup": {
                "from": collectionConst.LANGS,
                "localField": "nameId",
                "foreignField": "_id",
                "as": "province"
            }
        }, {
            "$unwind": "$province"
        }, {
            "$project": {
                "_id": 0,
                "total": "$total",
                "name": "$province.name"
            }
        }
    ], function (err, arr) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(arr);
        }
    })

    return deferred.promise;
}

module.exports = service;
