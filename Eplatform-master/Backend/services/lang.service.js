var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var config = require('../config.json');
var db = mongo.db(config.connectionString, { native_parser: true });
var collectionConst = require('../utils/system.const').COLLECTION;

db.bind(collectionConst.LANGS);


var service = {};
service.saveLang = saveLang;
service.updateLang = updateLang;
service.getLangs = getLangs;
service.langs = ["en", "vi"];
module.exports = service;

function saveLang(langData) {
    var deferred = Q.defer();

    langData.cre_ts = new Date();

    db[collectionConst.LANGS].insert(langData, function(err, doc) {
        if (err) deferred.reject(err);
        deferred.resolve(doc);
    });

    return deferred.promise;
}

function updateLang(_id, data) {
    var deferred = Q.defer();

    data.mod_ts = new Date();
    db[collectionConst.LANGS].update({
        _id: mongo.helper.toObjectID(_id)
    }, {
        $set: data
    }, function(err, doc) {
        if (err) deferred.reject(err);

        deferred.resolve(doc);
    });
    return deferred.promise;
}

function getLangs(_id) {
    var deferred = Q.defer();

    if (mongo.helper.isObjectID(_id)) {
        db[collectionConst.LANGS].findById(_id, function(err, lang) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve(lang);
        })
    } else {
        deferred.reject("_id not found")
    }

    return deferred.promise;
}