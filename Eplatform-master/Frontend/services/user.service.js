var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var typeValidate = require("utils/type.validate");
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, {
    native_parser: true
});
const collectionConst = require("../utils/system.const").COLLECTION;
var request = require('request');

var firebaseAdmin = require('firebase-admin');
var serviceAccount = require("./firebase.service.json");
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://eplatform-a6a31.firebaseio.com"
});

db.bind(collectionConst.USERACCOUNTS);
db.bind("level_current");
db.bind("level_field");
db.bind("avatar");

var service = {};
service.ERR_CODE = {
    ERROR: "error",
    EXIST: "exist",
    TERM: "term",
    AUTH_FAIL: "authFail",
    INVAI: "invai",
    NON_AUTH: "nonAuth"
}
service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.getFieldNextLevel = getFieldNextLevel;
service.getInfoLevelById = getInfoLevelById;
service.saveUserId = saveUserId;
service.updateStatus = updateStatus;
service.updateLevel = updateLevel;
service.checkExistsId = checkExistsId;
service.uploadImage = uploadImage;

module.exports = service;

function authenticate(username, password) {
    var deferred = Q.defer();

    db[collectionConst.USERACCOUNTS].findOne({
        username: username,
        isActive: true,
        isDelete: false
    }, function (err, user) {
        if (err) deferred.reject(service.ERR_CODE.ERROR);

        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve(jwt.sign({
                sub: user._id
            }, config.secret));
        } else {
            // authentication failed
            deferred.reject(service.ERR_CODE.AUTH_FAIL);
        }
    });

    return deferred.promise;
}

function getById(uid, token) {
    var deferred = Q.defer();

    request.get({
        headers: {
            'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1YmQ0MTAwMTg5NTE3OTJjNjQ0NWI4YzYiLCJ1c2VyIjp7Il9pZCI6IjViZDQxMDAxODk1MTc5MmM2NDQ1YjhjNiIsImZ1bGxuYW1lIjoiSG_DoG5nIEtpbSBUdeG6pW4iLCJ1c2VybmFtZSI6IkhvYW5nS2ltVHVhbiIsImctcmVjYXB0Y2hhLXJlc3BvbnNlIjoiIiwiaGFzaCI6IiQyYSQxMCRUZnBBME5BbzUwdUVKYXE5dFY4dnJ1MTU3ZC4uYmc3d1Jud3VlNm9HWDhPUFg2ZkZWUVNFUyIsInBob25lIjoiMDk2OTk4NzU0OCIsImNvdW50cnljb2RlIjoiKzg0IiwibW9kdGltZSI6IjE1NDI2MTg5NTA5MjEiLCJjb3ZlciI6eyJ1cmwiOiJodHRwOi8vc3NvLm5zby52bi9pbWFnZXMvYmFubmVycy81YmQ0MTAwMTg5NTE3OTJjNjQ0NWI4YzYuanBnP2RhdGU9MTU0MTkyODkxMTY3MSIsIl9pZCI6IjViZTdmN2NmMDAzMTIyMTJhMDE3YzUyNyJ9LCJpbnRyb2R1Y3Rpb24iOiJEZW1vIiwieWVhcm9mYmlydGgiOiIxOTk2IiwiZ2VuZGVyIjoiMSIsImVtYWlsIjoiaG9hbmdraW10dWFuMTk5NkBnbWFpbC5jb20iLCJhZGRyZXNzIjoiUXVhbiA5IiwiYXZhdGFyIjp7InVybCI6Imh0dHA6Ly9zc28ubnNvLnZuL2ltYWdlcy9hdmF0YXJzLzViZDQxMDAxODk1MTc5MmM2NDQ1YjhjNi5qcGc_ZGF0ZT0xNTQyNDUyMDY4ODgzIiwiX2lkIjoiNWJlZmYzNjQwZTdmYzUyZTIwNjBiMjlkIn0sImNhcmR2aXNpdCI6eyJ1cmwiOiJodHRwOi8vc3NvLm5zby52bi9pbWFnZXMvY2FyZHMvNWJkNDEwMDE4OTUxNzkyYzY0NDViOGM2LmpwZz9kYXRlPTE1NDIxMjk5NDgwNzkiLCJfaWQiOiI1YmViMDkxY2Y1NjU5MjI1NjA1NTUzOTUifSwiY29tcGFueSI6eyJfaWQiOiI1YjA2NGI4NGRjOTc1MzA5YjhmYWI2YTQiLCJuYW1lIjoiQkVITiBNRVlFUiBDby4sTHRkIiwiaXNTdG9yZSI6ZmFsc2UsInVybCI6ImJlaG4tbWV5ZXItY29sdGQifSwidGF4bnVtYmVyIjoiMTIzNDU2Iiwic3BlYWtpbmdsYW5ndWFnZXMiOiJFbmdsaXNoIiwicG9zaXRpb24iOnsibmFtZSI6IlByZXNpZGVudCIsIl9pZCI6IjViMDYyZTMxZGM5NzUzMTA1YzM4ZGExNiJ9LCJhZ3JlZW1lbnQiOnsidXJsIjoiaHR0cDovL3Nzby5uc28udm4vcGRmcy9hZ3JlZW1lbnRzLzE1NjAgY8OidSBUb2VpYyBjw7MgZ2nhuqNpIHRow61jaC5wZGY_ZGF0ZT0xNTQyNjE4NDUzOTA3IiwiX2lkIjoiNWJmMjdkNTUyZDgwYzAwYTcwZGU5MzNjIn0sImlkZW50aXR5Y2FyZCI6eyJ1cmwiOiJodHRwOi8vc3NvLm5zby52bi9pbWFnZXMvaWRlbnRpdHlzLzViZDQxMDAxODk1MTc5MmM2NDQ1YjhjNi5qcGc_ZGF0ZT0xNTQyMTMwMDUzOTA4IiwiX2lkIjoiNWJlYjA5ODVmNTY1OTIyNTYwNTU1Mzk3In0sInNvY2lhbG1lZGlhbGluayI6IkRlbW8ifSwiaWF0IjoxNTQyNjIxNjI5fQ.12CNHtih-ZtrgyYOa2txnUN5AeGpBSqBvpwU-jq2wS4"
        },
        url: config.ssoUrl + "/api/users/getCurrentUser?uid=" + uid,
        json: true
    }, function (error, response, body) {
        if (body && body.user) {
            checkExistsId(body.user._id)
                .then(function (data) {
                    if (data) {
                        body.user.current = data.current;
                        body.user.status = data.status;
                        deferred.resolve(body);
                    } else {
                        deferred.resolve({
                            statusCode: 403,
                            message: "User id not exist"
                        });
                    }
                })
                .catch(function (err) {
                    deferred.reject({
                        statusCode: 500,
                        err: err
                    });
                })
        } else {
            deferred.resolve({
                statusCode: 403,
                message: "User id not exist"
            });
        }
    });

    return deferred.promise;
}

function create(userParam) {
    var deferred = Q.defer();

    if (userParam.accept !== "on") {
        deferred.reject(service.ERR_CODE.TERM);
    }
    // validation
    db[collectionConst.USERACCOUNTS].findOne({
            username: userParam.username
        },
        function (err, user) {
            if (err) deferred.reject(service.ERR_CODE.ERROR);

            if (user) {
                // username already exists
                deferred.reject(service.ERR_CODE.EXIST);
            } else {
                firebaseAdmin.auth().getUserByPhoneNumber("+841667475660")
                    .then(function () {
                        createUser();
                    })
                    .catch(function () {
                        deferred.reject(service.ERR_CODE.NON_AUTH);
                    });
            }
        });

    function createUser() {
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');

        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);
        user.isDelete = false;
        user.cre_ts = new Date();
        user.name = "NSO Member";
        user.level = 1;
        user.textQuery = "nso member";
        user.completionRate = 75;
        user.isActive = true;


        db[collectionConst.USERACCOUNTS].insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(service.ERR_CODE.ERROR);
                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(uid, token, data) {
    var deferred = Q.defer();

    request.post({
        headers: {
            'Authorization': "Bearer " + token
        },
        url: config.ssoUrl + "/api/users/update?uid=" + uid,
        form: data,
    }, function (error, response, body) {
        if (error) deferred.reject(service.ERR_CODE.ERROR);

        deferred.resolve(body);
    });

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db[collectionConst.USERACCOUNTS].remove({
            _id: mongo.helper.toObjectID(_id)
        },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function getFieldNextLevel(currentLevel) {
    var deferred = Q.defer();

    db.level_field.findOne({},
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            switch (currentLevel) {
                case 0:
                    deferred.resolve(doc.listfieldlv1);
                    break;
                case 1:
                    deferred.resolve(doc.listfieldlv2);
                    break;
                case 2:
                    deferred.resolve(doc.listfieldlv3);
                    break;
                default:
                    deferred.resolve();
            }
        });

    return deferred.promise;
}

function getInfoLevelById(uid) {
    var deferred = Q.defer();

    db.level_current.findOne({
            uid: uid
        },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve(doc);
        });

    return deferred.promise;
}

function saveUserId(uid) {
    var deferred = Q.defer();

    db.level_current.findOne({
            uid: uid
        },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (!doc) {
                var currentUser = {}
                currentUser.uid = uid;
                currentUser.current = 0;
                currentUser.status = 1;
                db.level_current.insert(
                    currentUser,
                    function (err, doc) {
                        if (err) deferred.reject();

                        deferred.resolve();
                    });
            } else {
                deferred.resolve();
            }
        });

    return deferred.promise;
}

function updateStatus(uid, status) {
    var deferred = Q.defer();

    db.level_current.findOne({
            uid: uid
        },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (doc) {
                var set = {
                    status: status
                }
                db.level_current.update({
                        _id: mongo.helper.toObjectID(doc._id)
                    }, {
                        $set: set
                    },
                    function (err, doc) {
                        if (err) deferred.reject();

                        deferred.resolve(status);
                    });
            } else {
                deferred.resolve();
            }
        });

    return deferred.promise;
}

function checkExistsId(uid) {
    var deferred = Q.defer();

    db.level_current.findOne({
            uid: uid
        },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (doc) {
                deferred.resolve(doc);
            } else {
                deferred.resolve();
            }
        });

    return deferred.promise;
}

function uploadImage(url) {
    var deferred = Q.defer();

    db.avatar.insert(
        {
            url: url
        },
        function (err, doc) {
            if (err) deferred.reject(service.ERR_CODE.ERROR);

            deferred.resolve(doc.ops[0]);
        });

    return deferred.promise;
}

function updateLevel(uid, status) {
    var deferred = Q.defer();

    db.level_current.findOne({
            uid: uid
        },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (doc) {
                current = doc.current;
                if (status == 1) {
                    current = doc.current + 1;
                }
                var set = {
                    status: status,
                    current: current
                }
                db.level_current.update({
                        _id: mongo.helper.toObjectID(doc._id)
                    }, {
                        $set: set
                    },
                    function (err, doc) {
                        if (err) deferred.reject();

                        deferred.resolve(set);
                    });
            } else {
                deferred.resolve();
            }
        });

    return deferred.promise;
}