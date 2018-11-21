var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
var systemConst = require("./system.const");
var typeCast = require("../utils/type.cast");
const collectionConst = require("../utils/system.const").COLLECTION;

var unsafeDb = mongo.db(config.reportConnectionString, { native_parser: true });
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind(collectionConst.SEARCHQUERIES);
db.bind(collectionConst.COMPANIES);
db.bind(collectionConst.SETTINGS);



unsafeDb.bind("client_contacts");
unsafeDb.bind("client_reports");
unsafeDb.bind("client_subscribe");
unsafeDb.bind("client_feedback");
unsafeDb.bind("client_cookies");
unsafeDb.bind("client_companies");
unsafeDb.bind("client_uuids");

var service = {};
service.postFeedback = postFeedback;
service.postReportCompany = postReportCompany;
service.postSubscribe = postSubscribe;
service.postContact = postContact;
service.postCookie = postCookie;
service.postCookieDownloadApp = postCookieDownloadApp;
service.postContactCompany = postContactCompany;

service.newCookie = newCookie;
service.countSearch = countSearch;
service.countCountry = countCountry;
service.getCookie = getCookie;
service.getCookieDownloadApp = getCookieDownloadApp;
// 

function newCookie() {
    var deferred = Q.defer();
    db.ep_settings.update({}, {
        "$inc": { visitor: 1 }
    }, function (err, total) {
        if (err) {
            deferred.resolve(0);
        } else {
            deferred.resolve(total);
        }
    })
    return deferred.promise;
}

newCookie();

function countSearch() {
    var deferred = Q.defer();
    db.system_searchQueries.count({}, function (err, total) {
        if (err) {
            deferred.resolve(0);
        } else {
            deferred.resolve(total);
        }
    })
    return deferred.promise;
}

function countCountry() {
    var deferred = Q.defer();
    db.ep_companies.aggregate([
        {
            "$match": {
                "isDelete": false,
                "isActive": true,
                "address.countryId": {
                    "$ne": null
                }
            }
        }, {
            "$group": {
                "_id": "$address.countryId"
            }
        }
    ], function (err, arr) {
        if (err) {
            deferred.resolve(1);
        } else {
            deferred.resolve(arr.length);
        }
    })
    return deferred.promise;
}

// post function
function postReportCompany(reportData) {
    var deferred = Q.defer();
    function __validateReportData(__reportData) {

        return true;
    }
    if (__validateReportData(reportData)) {
        unsafeDb.client_reports.insert({
            "website": systemConst.siteCode,
            "cre_ts": new Date(),
            "data": reportData,
            "type": systemConst.typeData.report
        }, function (err, doc) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(doc);
            }
        })
    }
    return deferred.promise;
}
function postContactCompany(contactData) {
    var deferred = Q.defer();
    function __validateContactData(__contactData) {
        
        return true;
    }
    if (__validateContactData(contactData)) {
        unsafeDb.client_companies.insert({
            "website": systemConst.siteCode,
            "cre_ts": new Date(),
            "data": contactData,
            "type": systemConst.typeData.companyContact
        }, function (err, doc) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(doc);
            }
        })
    }
    return deferred.promise;
}
function postFeedback(feedbackData) {
    var deferred = Q.defer();
    function __validateFeedbackData(__feedbackData) {

        return true;
    }
    if (__validateFeedbackData(feedbackData)) {
        unsafeDb.client_feedback.insert({
            "website": systemConst.siteCode,
            "cre_ts": new Date(),
            "data": feedbackData,
            "type": systemConst.typeData.feedback
        }, function (err, doc) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(doc);
            }
        })
    }
    return deferred.promise;
}
function postSubscribe(subscribeData) {
    var deferred = Q.defer();
    function __validateSubscribeData(__subscribeData) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(__subscribeData.email).toLowerCase());
    }

    if (__validateSubscribeData(subscribeData)) {
        unsafeDb.client_subscribe.count({
            "website": systemConst.siteCode,
            "data.email": subscribeData.email,
            "type": systemConst.typeData.subscribe
        }, function (err, total) {
            if (err) deferred.reject("error");
            else {
                if (total > 0) {
                    deferred.reject("exist");
                } else {
                    unsafeDb.client_subscribe.insert({
                        "website": systemConst.siteCode,
                        "cre_ts": new Date(),
                        "data": subscribeData,
                        "type": systemConst.typeData.subscribe
                    }, function (err, doc) {
                        if (err) {
                            deferred.reject("error");
                        } else {
                            deferred.resolve(doc);
                        }
                    })
                }
            }
        })
    } else {
        deferred.reject("validate");
    }
    return deferred.promise;
}
function postContact(contactData) {
    var deferred = Q.defer();
    function __validateContactData(__contactData) {
        
        return true;
    }
    if (__validateContactData(contactData)) {
        unsafeDb.client_contacts.insert({
            "website": systemConst.siteCode,
            "cre_ts": new Date(),
            "data": contactData,
            "type": systemConst.typeData.contact
        }, function (err, doc) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(doc);
            }
        })
    }
    return deferred.promise;
}
function postCookie(cookieData) {
    var deferred = Q.defer();
    function __validateCookieData(__cookieData) {
        if (__cookieData.uuid.match(/^([a-z0-9\-]+)$/)) {
            return true;
        }
        return true;
    }
    if (__validateCookieData(cookieData)) {
        unsafeDb.client_cookies.count({
            "website": systemConst.siteCode,
            "data.uuid": cookieData.uuid,
            "type": systemConst.typeData.cookie
        }, function (err, total) {
            if (err || total == 0) {
                insertCookie();
            } else {
                deferred.resolve({});
            }
        })
    }
    function insertCookie() {
        unsafeDb.client_cookies.insert({
            "website": systemConst.siteCode,
            "cre_ts": new Date(),
            "data": cookieData,
            "type": systemConst.typeData.cookie
        }, function (err, doc) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(doc);
            }
        })
    }
    return deferred.promise;
}

function postCookieDownloadApp(cookieData) {
    var deferred = Q.defer();
    function __validateCookieData(__cookieData) {
        if (__cookieData.uuid.match(/^([a-z0-9\-]+)$/)) {
            return true;
        }
        return true;
    }
    if (__validateCookieData(cookieData)) {
        unsafeDb.client_cookies.count({
            "website": systemConst.siteCode,
            "data.uuid": cookieData.uuid,
            "type": systemConst.typeData.downloadApp
        }, function (err, total) {
            if (err || total == 0) {
                insertCookie();
            } else {
                deferred.resolve({});
            }
        })
    }
    function insertCookie() {
        unsafeDb.client_cookies.insert({
            "website": systemConst.siteCode,
            "cre_ts": new Date(),
            "data": cookieData,
            "type": systemConst.typeData.downloadApp
        }, function (err, doc) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(doc);
            }
        })
    }
    return deferred.promise;
}

function getCookie(uuid) {
    var deferred = Q.defer();
    function __validateCookieData(__uuid) {
        if (__uuid.match(/^([a-z0-9\-]+)$/)) {
            return true;
        }
        return true;
    }
    if (__validateCookieData(uuid)) {
        unsafeDb.client_cookies.count({
            "website": systemConst.siteCode,
            "data.uuid": uuid,
            "type": systemConst.typeData.cookie
        }, function (err, total) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(total);
            }
        })
    }
    return deferred.promise;
}

function getCookieDownloadApp(uuid) {
    var deferred = Q.defer();
    function __validateCookieData(__uuid) {
        if (__uuid.match(/^([a-z0-9\-]+)$/)) {
            return true;
        }
        return true;
    }
    if (__validateCookieData(uuid)) {
        unsafeDb.client_cookies.count({
            "website": systemConst.siteCode,
            "data.uuid": uuid,
            "type": systemConst.typeData.downloadApp
        }, function (err, total) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(total);
            }
        })
    }
    return deferred.promise;
}

module.exports = service;