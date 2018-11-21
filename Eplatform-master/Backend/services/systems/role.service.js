var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
var config = require('../../config.json');
var db = mongo.db(config.connectionString, { native_parser: true });
var roleValidate = require("../../utils/role.validate");
var collectionConst = require('../../utils/system.const').COLLECTION;
var roleCfg = require("../../modules/config").modules[collectionConst.ROLES];

db.bind(collectionConst.ROLES);
db.bind(collectionConst.USERS);


var service = {};
service.getPerms = getPerms;
service.getFullPerms = getFullPerms;
module.exports = service;

function getFullPerms() {
    var deferred = Q.defer();
    if (Array.isArray(roleCfg.fields)) {
        let perms = {};
        roleCfg.fields.forEach(function (field) {
            perms[field.attr] = {};
            perms[field.attr][roleValidate.ACTION.AS_ADMIN] = true;
        })
        deferred.resolve(perms);
    } else {
        deferred.reject("Role config error");
    }
    return deferred.promise;
}

function getPerms(userId) {
    var deferred = Q.defer();

    db[collectionConst.USERS].findById(userId, function(err, user) {
        if (err) deferred.reject(err);

        if (user && user.roleIds) {
            let roleIds = user.roleIds.map(function(e) {
                return mongo.helper.toObjectID(e);
            });

            db[collectionConst.ROLES].find({
                _id: {
                    "$in": roleIds
                },
                "isDelete": false
            }).toArray(function(err, rows) {
                let roles = {};

                rows.map(function(e) {
                    return _.omit(e, ["_id", "cre_ts", "mod_ts", "isActive", "isDelete", "name", "userId"])
                }).forEach(function(e) {
                    for (var _module in e) {
                        if (roles[_module] === undefined) {
                            roles[_module] = {};
                        }
                        for (var role in e[_module]) {
                            roles[_module][role] = roles[_module][role] || e[_module][role];
                        }
                    }
                }, this);
                deferred.resolve(roles);
            });
        } else
            deferred.resolve([]);
    });

    return deferred.promise;
}