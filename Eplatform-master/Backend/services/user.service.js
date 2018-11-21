var config = require('../config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
var roleService = require("../services/systems/role.service");
var collectionConst = require('../utils/system.const').COLLECTION;

db.bind(collectionConst.USERS);

var service = {};

service.authenticate = authenticate;
service.getById = getById;
service.getAll = getAll;
service.create = create;
service.update = update;
service.delete = _delete;
service.getPage = getPage;
module.exports = service;

function authenticate(username, password) {
    var deferred = Q.defer();
    db[collectionConst.USERS].findOne({ username: username }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            let getPerm = undefined;
            if (user.userId && user._id.toString() == user.userId.toString()) {
                getPerm = roleService.getFullPerms();
            } else {
                getPerm = roleService.getPerms(user._id);
            }
            
            getPerm.then(function (perms) {
                    let sub = {
                        _id: user._id,
                        perms: perms
                    }
                    deferred.resolve(jwt.sign({ sub: sub }, config.secret));
                })
                .catch(function (err) {
                    deferred.reject("Error when we try to getting your permission");
                })
            
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getPage(page, filterData) {
    var deferred = Q.defer();
    
    let filter = {};
    if (filterData && filterData.field && filterData.value)
        filter[filterData.field] = new RegExp(filterData.value, "uig");

    db[collectionConst.USERS].find(filter).skip(page * config.numRowPerPage).limit(config.numRowPerPage).toArray(function (err, users) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (users) {
            db[collectionConst.USERS].count(filter, function (err, num) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                
                deferred.resolve({
                    rows: users.map(function (user) {
                        return _.omit(user, 'hash')
                    }),
                    count: num,
                    numRowPerPage: config.numRowPerPage
                });
            })
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db[collectionConst.USERS].findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getAll() {
    var deferred = Q.defer();

    db[collectionConst.USERS].find().toArray(function (err, users) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (users) {
            deferred.resolve(users.map(function (user) {
                return _.omit(user, 'hash')
            }));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(userParam) {
    var deferred = Q.defer();

    // validation
    db[collectionConst.USERS].findOne(
        { username: userParam.username },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                // username already exists
                deferred.reject('Username "' + userParam.username + '" is already taken');
            } else {
                createUser();
            }
        });

    function createUser() {
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');

        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);
        user.cre_ts = new Date();

        db[collectionConst.USERS].insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    db[collectionConst.USERS].findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            db[collectionConst.USERS].findOne(
                { username: userParam.username },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            mod_ts: new Date(),
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            // username: userParam.username,
        };

        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        db[collectionConst.USERS].update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db[collectionConst.USERS].remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}