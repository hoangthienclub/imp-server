var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var config = require('../../config.json');
var deepDiff = require("deep-diff");
var collectionConst = require('../../utils/system.const').COLLECTION;

var db = mongo.db(config.connectionString, { native_parser: true });

db.bind(collectionConst.LOGS);


var service = {};
service.save = save;
module.exports = service;

function save(action, collection, _id, oldObj, newObj) {
    var deferred = Q.defer();
    
    var differences = (oldObj != {} ? deepDiff(oldObj, newObj) : newObj);
    
    if (!differences) {
        deferred.resolve();
    } else {
        var insert = {
            action: action,
            rowId: mongo.helper.toObjectID(_id),
            collection: collection,
            data: differences,
            cre_ts: new Date()
        };

        db[collectionConst.LOGS].insert(insert, function (err, doc) {
            if (err) deferred.reject(err);
            else {
                deferred.resolve(doc);
            }
        });
    }

    return deferred.promise;
}