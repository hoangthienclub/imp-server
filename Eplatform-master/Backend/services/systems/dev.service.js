var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
var config = require('../../config.json');
let db = mongo.db(config.connectionString, { native_parser: true });
var collectionConst = require('../../utils/system.const').COLLECTION;
db.bind(collectionConst.DEVELOPMENTMODULES);

var service = {};

service.updateModule = updateModule;


function updateModule(moduleCfg) {
    let deferred = Q.defer();
    let cfg = _.omit(JSON.parse(JSON.stringify(moduleCfg)), ["collection", "moduleName", "model", "routes", "lookupField", "submit"]);
    cfg.fields = cfg.fields.map((e) => {
        delete e.label
        return e;
    })

    db[collectionConst.DEVELOPMENTMODULES].find({"collection": moduleCfg.collection}).toArray(function(err, arr) {
        if (err) {
            deferred.reject("Error in update module function")
        } else {
            if (arr.length == 0) {
                db[collectionConst.DEVELOPMENTMODULES].insert({
                    "collection": moduleCfg.collection, 
                    "config": cfg,
                    "name": moduleCfg.moduleName
                }, function (err, doc) {
                    if (err) {
                        deferred.reject("Error in update module function")
                    } else {
                        deferred.resolve();
                    }
                })
            } else {
                db[collectionConst.DEVELOPMENTMODULES].update({
                    "collection": moduleCfg.collection
                }, {
                    "$set": {
                        "config": cfg,
                        "name": moduleCfg.moduleName
                    }
                }, function (err, doc) {
                    if (err) {
                        deferred.reject("Error in update module function")
                    } else {
                        deferred.resolve();
                    }
                })
            }
        }
    })

    return deferred.promise;
}


module.exports = service;