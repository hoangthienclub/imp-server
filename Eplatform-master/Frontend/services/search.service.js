var zerorpc = require("zerorpc");
var Q = require("q");
const collectionConst = require("../utils/system.const").COLLECTION;
var mongo = require('mongoskin');
var config = require('../config.json');
var db = mongo.db(config.connectionString, { native_parser: true });

var client700K = new zerorpc.Client({heartbeatInterval: 60000, timeout: 60 });
var client10K = new zerorpc.Client({heartbeatInterval: 60000, timeout: 60 });

client700K.connect("tcp://103.90.220.79:5252");
client10K.connect("tcp://103.90.220.79:5253");

var clientDict = {
    "10K": client10K,
    "700K": client700K
}


db.bind(collectionConst.SEARCHQUERIES);

function search (query, clientType="10K") {
    let deferred = Q.defer();
    
    clientDict[clientType].invoke("map_view", query, function(error, res, more) {
        if (error) {
            deferred.reject(error);
        } else {
            deferred.resolve(res);
        }
    });
    return deferred.promise;
}
function viewbox (query, clientType="10K") {
    let deferred = Q.defer();
    clientDict[clientType].invoke("list_view", query, function(error, res, more) {
        if (error) {
            deferred.reject(error);
        } else {
            deferred.resolve(res);
        }
    });
    return deferred.promise;
}

function storeQuery(uuid, query) {
    let deferred = Q.defer();
    db[collectionConst.SEARCHQUERIES].insert({ uuid: uuid, query: query }, function(error, doc) {
        if (error) {
            console.log(error);
            deferred.resolve();
        } else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}

var service = {}
service.storeQuery = storeQuery;
service.search = search;
service.viewbox = viewbox;

module.exports = service;