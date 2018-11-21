var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
var systemConst = require("../system.const");
var typeCast = require("../../utils/type.cast");
var typeValidate = require("../../utils/type.validate");
var db = mongo.db(config.connectionString, { native_parser: true });
const collectionConst = require("../../utils/system.const").COLLECTION;

db.bind(collectionConst.DEVELOPMENTMODULES);
db.bind(collectionConst.LANGS);

var modules = {};

function initService() {
    function __init(cfg) {
        db.bind(cfg.collection);

        modules[cfg.collection] = {
            params: cfg.config.fields.filter((e) => {
                return e.inputType == "number";
            }),
            files: cfg.config.fields.filter((e) => {
                return e.inputType == "file";
            }),
            tags: cfg.config.fields.filter((e) => {
                return ["email", "tel"].indexOf(e.inputType) >= 0;
            }),
            select_lookups: cfg.config.fields.filter((e) => {
                return e.inputType == "select_lookup";
            }),
            maps: cfg.config.fields.filter((e) => {
                return e.inputType == "map";
            }),
            quickChecks: cfg.quickChecks,
            multiLang: cfg.config.multiLang != false,
            supportSearchByUrl: cfg.config.fields.find(function (e) {
                return e.inputType == "text" && e.slug == true;
            }) != null
        }
    }

    db.ep_developmentModules.find().toArray(function(err, arr) {
        if (err) {
            console.log("Error in init service", err);
        } else {
            arr.forEach(element => {
                __init(element);
            });

            console.log("Init completed");
        }
    })
}

initService();

function parseCondition(collection, condition, nonValidateCondition) {
    let obj = {};
    Object.assign(obj, nonValidateCondition);
    for (let field of modules[collection].params) {
        if (condition[field.attr] !== undefined) {
            obj[field.attr] = typeCast.castNumeric(condition[field.attr]);
        }
    }
    // for (let field of modules[collection].quickChecks) {
    //     if (condition[field.attr] !== undefined) {
    //         obj[field.attr] = typeCast.castBool(condition[field.attr]);
    //     }
    // }
    if (condition.textQuery) {
        obj.textQuery = new RegExp(typeCast.castSlug(condition.textQuery));
    }
    if (condition._id) {
        if (Array.isArray(condition._id)) {
            obj._id = {
                "$in": condition._id.map(e => typeCast.castObjectId(e))
            }
        } else if (typeof condition._id == typeof {}) {
            if ("$nin" in condition._id) {
                obj._id = {
                    "$nin": condition._id["$nin"].map(e => typeCast.castObjectId(e))
                }
            }
        } else {
            obj._id = {
                "$in": [typeCast.castObjectId(condition._id)]
            }
        }
    }
    if (condition.companyId) {
        if (Array.isArray(condition.companyId)) {
            obj.companyId = {
                "$in": condition.companyId.map(e => typeCast.castObjectId(e))
            }
        } else {
            obj.companyId = {
                "$in": [typeCast.castObjectId(condition.companyId)]
            }
        }
    }
    if (condition.groupId) {
        if (Array.isArray(condition.groupId)) {
            obj.groupId = {
                "$in": condition.groupId.map(e => typeCast.castObjectId(e))
            }
        } else {
            obj.groupId = {
                "$in": [typeCast.castObjectId(condition.groupId)]
            }
        }
    }
    obj.isDelete = false;
    return obj;
}

function editResponse(collection, outputData) {
    outputData = _.omit(outputData, delAttrs.concat([]));
    for (let obj of modules[collection].tags) {
        if (Array.isArray(outputData[obj.attr])){
            outputData[obj.attr] = outputData[obj.attr].map((e) => {
                return e.text;
            })
        } else {
            outputData[obj.attr] = [];
        }
    }
    for (let obj of modules[collection].maps) {
        if (outputData[obj.attr] != null && typeof outputData[obj.attr] == "object"){
            try {
                outputData[obj.attr].raw = outputData.data[obj.attr].rawAddress;
                delete outputData.data[obj.attr];
            } catch (ex) {};
        }
    }
    for (let obj of modules[collection].files) {
        if (Array.isArray(outputData[obj.attr])){
            outputData[obj.attr].forEach(function (elem) {
                try {
                    elem.url = elem.url.trim();
                    elem.name = elem.name.trim();
                    delete elem.path;
                } catch (ex) {};
            })
        } else {
            try {
                outputData[obj.attr].url = outputData[obj.attr].url.trim();
                outputData[obj.attr].name = outputData[obj.attr].name.trim();
                delete outputData[obj.attr].path;
            } catch (ex) {};
        }
    }
    for (let obj of modules[collection].select_lookups) {
        if (Array.isArray(outputData[obj.attr])){
            outputData[obj.attr] = outputData[obj.attr].filter(e => e !== undefined && e !== null ).map((e) => {
                if (typeof e == "string") {
                    return e;
                } else {
                    if (typeValidate.validateObjectId(e)) {
                        return e;
                    } else {
                        return e.id;
                    }
                }
            });
        } else {
            if (outputData[obj.attr] !== null && outputData[obj.attr] !== undefined) {
                if (outputData[obj.attr].id && outputData[obj.attr].text) {
                    outputData[obj.attr] = [outputData[obj.attr].id];
                } else {
                    outputData[obj.attr] = [outputData[obj.attr]];
                }
                outputData[obj.attr] = outputData[obj.attr].filter(e => typeValidate.validateObjectId(e))
            } else {
                outputData[obj.attr] = [];
            }
        }
    }
    if (modules[collection].multiLang) {
        outputData.data = _.omit(outputData.data, delAttrs.concat(["_id", "mod_ts", "cre_ts", "userId", "modByUserId"]));
        Object.assign(outputData, outputData.data);
        delete outputData.data;
    }
    return outputData;
}

function findLangByUrl(url) {
    let _deferred = Q.defer();
    db[collectionConst.LANGS].find({"url": typeCast.castText(url)}, {"_id": 1}).toArray(function (err, arr) {
        if (err) {
            _deferred.reject(err);
        } else {
            _deferred.resolve(arr);
        }
    });
    return _deferred.promise;
}

var service = {};
service.count = count;
service.counts = counts;
service.getOne = getOne;
service.getById = getById;
service.getList = getList;
service.getByUrl = getByUrl;

/**
 * Danh sách cách thuộc tính loại bỏ trong mỗi bản ghi trước khi trả về cho client
 */
delAttrs = ["isActive", "isDelete", "textQuery", "completionRate", "isCheckLogo", "facebook", "twitter", "google", "linkedin", "undefined"];


/**
 * Lấy về document trong { colection } với điều kiện { condition } do người dùng truyền lên
 * { nonValidateCondition } do lập trình viên truyền vào để thực hiện 1 số chức năng riêng
 * Ngôn ngữ trả về tương ứng với { lang }
 * @param {string} collection 
 * @param {object} condition 
 * @param {string} lang 
 * @param {object} nonValidateCondition 
 * @param {boolean} getGeometry
 */
function getOne(collection, condition, lang="en", nonValidateCondition={}, getGeometry = false) {
    var deferred = Q.defer();
    if (modules[collection]) {
        let aggregateData = [
            {
                "$match": parseCondition(collection, condition, nonValidateCondition)
            }
        ];
        aggregateData.push({ "$limit": 1 });
        aggregateData.push({ "$skip" : 0 });

        if (modules[collection].multiLang) {
            aggregateData.push({
                "$lookup": {
                    "from": collectionConst.LANGS,
                    "localField": "data." + lang,
                    "foreignField": "_id",
                    "as": "data"
                }
            });
            aggregateData.push({
                "$unwind": "$data"
            });
        }
        aggregateData.push({"$project": {geometry: getGeometry}});
        db[collection].aggregate(aggregateData, { allowDiskUse: true }, function(err, arr) {
            if (err) {
                deferred.reject(systemConst.query.error)
            } else {
                let obj = arr.length > 0 ? arr[0] : {};
                deferred.resolve(editResponse(collection, obj));
            }
        });
    } else {
        console.log(1, collection);
        deferred.reject(systemConst.collection.unknown);
    }
    return deferred.promise;
}

/**
 * Lấy về document trong { collection } có { _id } truyền vào với ngôn ngữ { lang }
 * @param {string} collection 
 * @param {ObjectId} _id 
 * @param {string} lang 
 */
function getById(collection, _id, lang="en", getGeometry=false) {
    return getOne(collection, {_id: _id}, lang, getGeometry);
}

/**
 * Lấy về danh sách document trong { collection } với điều kiện { condition } do người dùng truyền lên
 * Điều kiện { nonValidateCondition } do lập trình viên truyền vào để thực hiện các chức năng đặc biệt
 * Số lượng bản ghi trả về là { numRecord } với ngôn ngữ { lang }, kết quả được sắp xếp theo { sort }
 * @param {string} collection 
 * @param {object} condition 
 * @param {string} lang 
 * @param {number} numRecord 
 * @param {object} nonValidateCondition 
 * @param {object} sort 
 */
function getList(collection, condition, lang="en", numRecord=undefined, nonValidateCondition={}, sort={}) {
    var deferred = Q.defer();
    let page = condition.page ? typeCast.castNumeric(condition.page) : 0;
    let numRowPerPage = (numRecord ? typeCast.castNumeric(numRecord) : config.numRowPerPage);
    
    if (modules[collection]) {
        let aggregateData = [
            {
                "$match": parseCondition(collection, condition, nonValidateCondition)
            }
        ];
        aggregateData.push({"$project": {geometry: false}});
        if (Object.keys(sort).length > 0) {
            aggregateData.push({"$sort": sort})
        }
        aggregateData.push({
            '$group': {
                "_id": null,
                "total": {
                    "$sum": 1
                }, 
                "rows": {
                    '$push': '$$ROOT'
                }
            }
        })
        aggregateData.push({
            '$unwind': "$rows"
        })

        aggregateData.push({ "$limit": (page + 1) * numRowPerPage });
        aggregateData.push({ "$skip" : page * numRowPerPage });

        if (modules[collection].multiLang) {
            aggregateData.push({
                "$lookup": {
                    "from": collectionConst.LANGS,
                    "localField": "rows.data." + lang,
                    "foreignField": "_id",
                    "as": "rows.data"
                }
            });
            aggregateData.push({
                "$unwind": "$rows.data"
            });
        }
        aggregateData.push({"$group":{"_id": null, "total": {"$first": "$total"},"rows": {"$push":"$rows"}}});
        db[collection].aggregate(aggregateData, { allowDiskUse: true }, function(err, arr) {
            if (err) {
                deferred.reject(systemConst.query.error)
            } else {
                if (arr.length > 0) {
                    let obj = arr[0];
                    obj.totalPage = Math.ceil(obj.total / numRowPerPage)
                    obj.currentPage = page,
                    obj.rows = obj.rows.map((e) => editResponse(collection, e));
                    deferred.resolve(obj);
                } else {
                    deferred.resolve({
                        total: 0,
                        totalPage: 0,
                        currentPage: page,
                        rows: []
                    });
                }
            }
        });
    } else {
        deferred.reject(systemConst.collection.unknown)
    }
    return deferred.promise;
}

/**
 * Đếm số lượng document trong { collection } phù hợp điều kiện { condition }
 * @param {string} collection 
 * @param {object} condition 
 * @param {object} nonValidateCondition 
 */
function count(collection, condition, nonValidateCondition={}) {
    var deferred = Q.defer();
    if (modules[collection]) {
        db[collection].count(parseCondition(collection, condition, nonValidateCondition), function(err, total) {
            if (err) {
                deferred.reject(systemConst.query.error)
            } else {
                deferred.resolve({total: total})
            }
        })
    } else {
        deferred.reject(systemConst.collection.unknown)
    }
    return deferred.promise;
}



/**
 * Đếm số lượng document trong { collection } phù hợp điều kiện { condition }
 * @param {string} collection 
 * @param {string} key 
 * @param {object} condition 
 * @param {object} nonValidateCondition 
 */
function counts(collection, key, condition, nonValidateCondition={}) {
    var deferred = Q.defer();
    if (modules[collection]) {
        db[collection].aggregate([
            {
                "$match": parseCondition(collection, condition, nonValidateCondition)
            }, {
                "$group": {
                    "_id": "$" + key,
                    "total": { "$sum": 1 }
                }
            }
        ], { allowDiskUse: true }, function(err, arr) {
            if (err) {
                deferred.reject(systemConst.query.error)
            } else {
                let ret = {};
                for (let e of arr) {
                    ret[e._id] = e.total;
                }
                deferred.resolve(ret);
            }
        })
    } else {
        deferred.reject(systemConst.collection.unknown)
    }
    return deferred.promise;
}


/**
 * Lấy về document thuộc { collection } có giá trị url khớp với { url }
 * Kết quả trả về có ngôn ngữ { lang }
 * @param {string} collection 
 * @param {string} url 
 * @param {string} lang 
 */
function getByUrl(collection, url, lang="en") {
    var deferred = Q.defer();
    if (modules[collection]) {
        if (modules[collection].supportSearchByUrl) {
            let promises = [findLangByUrl(url)]
            Q.all(promises)
                .then(function (res) {
                    let match = {};
                    match["$or"] = config.langs.map(function (e) {
                        data = {};
                        data["data." + e] = {
                            "$in": res[0].map(e => e._id)
                        }
                        return data;
                    });
                    let aggregateData = [
                        {
                            "$match": match
                        }
                    ];
                    aggregateData.push({ "$limit": 1 });
                    aggregateData.push({ "$skip" : 0 });
            
                    if (modules[collection].multiLang) {
                        aggregateData.push({
                            "$lookup": {
                                "from": collectionConst.LANGS,
                                "localField": "data." + lang,
                                "foreignField": "_id",
                                "as": "data"
                            }
                        });
                        aggregateData.push({
                            "$unwind": "$data"
                        });
                    }
                    
                    db[collection].aggregate(aggregateData, { allowDiskUse: true }, function(err, arr) {
                        if (err) {
                            deferred.reject(systemConst.query.error)
                        } else {
                            let obj = arr.length > 0 ? arr[0] : {};
                            deferred.resolve(editResponse(collection, obj));
                        }
                    });
                })
                .catch(function (err) {
                    deferred.reject(systemConst.query.error)
                })
        } else {
            deferred.reject(systemConst.collection.notSupport);
        }
    } else {
        deferred.reject(systemConst.collection.unknown);
    }
    return deferred.promise;
}



service.countDistinct = countDistinct;
service.getListName = getListName;
service.getListNameCompany = getListNameCompany;
service.getListNamePosition = getListNamePosition;
service.getListSearch = getListSearch;
service.getProvinceGeometry = getProvinceGeometry;
service.getIndustrialParkGeometry = getIndustrialParkGeometry;
service.getIndustrialParkInfoPopup = getIndustrialParkInfoPopup;
service.getProvinceInfoPopup = getProvinceInfoPopup;
// company services
service.getCompanyLocation = getCompanyLocation;
service.getCompanyInfo = getCompanyInfo;
service.getViewBox = getViewBox;
service.getCompanyCategory = getCompanyCategory;
service.getListCompanyInfos = getListCompanyInfos; 
service.updateImageProfile = updateImageProfile;
service.getCompanyNames = getCompanyNames;

function countDistinct(collection, condition) {
    var deferred = Q.defer();
    if (modules[collection]) {
        db[collection].distinct(condition, function(err, total) {
            if (err) {
                deferred.reject(systemConst.query.error)
            } else {
                deferred.resolve({total: total.length})
            }
        })
    } else {
        deferred.reject(systemConst.collection.unknown)
    }
    return deferred.promise;
}

function getViewBox (ids, lang="en") {
    var deferred = Q.defer();
    service.getList(collectionConst.COMPANIES, {_id: ids}, lang, 20, {})
        .then(function (obj) {
            let promises = [];
            for (let e of obj.rows) {
                promises.push(service.getList(collectionConst.COMPANYCATEGORIES, {_id: e.companyCategoryId}, lang, undefined, {groupId: typeCast.castObjectId("5b062e32dc9753105c38da55")}));
                promises.push(service.getOne(collectionConst.MAPPROVINCES, {}, lang, {_id: e.address.provinceId}));
            }
            Q.all(promises)
                .then(function (arr) {
                    for (let e in obj.rows) {
                        obj.rows[e].categories = arr[2 * e].rows;
                        obj.rows[e].provinceData = arr[2 * e + 1];
                    }
                    deferred.resolve(obj);
                })
                .catch(function (err) {
                    deferred.reject(err);
                })
        })
        .catch(function (err) {
            deferred.reject(err);
        })

    return deferred.promise;
}

function getCompanies(lang="en") {
    var deferred = Q.defer();
    if (!db[collectionConst.COMPANIES])
        db.bind(collectionConst.COMPANIES);

    db[collectionConst.COMPANIES].aggregate([
        {
            "$match": {
                isDelete: false,
                isActive: true,
                taxNumber: { "$ne": "" },
                textQuery: { "$ne": "" }
            }
        }, {
            "$sort": {
                "completionRate": -1
            }
        }, {
            "$project": {
                "address": "$address",
                "industrialParkId": "$industrialParkId",
                "companyCategoryIds": "$companyCategoryId",
                "data": "$data." + lang
            }
        }, {
            "$lookup": {
                "from": collectionConst.LANGS,
                "localField": "data",
                "foreignField": "_id",
                "as": "data"
            }
        }, {
            "$unwind": "$data"
        }, {
            "$project": {
                "latLng": "$address.latLng",
                "districtId": "$address.districtId",
                "provinceId": "$address.provinceId",
                "industrialParkId": "$industrialParkId",
                "companyCategoryIds": "$companyCategoryIds",
                "name": "$data.name",
                "url": "$data.url"
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

function getCompanyLocation(lang="en") {
    var deferred = Q.defer();
    
    Q.all([
        getCompanies(lang),
        service.getList(collectionConst.COMPANYCATEGORIES, {}, lang, 1000, {groupId: typeCast.castObjectId("5b062e32dc9753105c38da55")})
    ]).then(function (arr) {
        let data = {category: {}, companies: []};
        arr[1].rows.forEach((e) => {
            data.category[e._id.toString()] = e.imageMarkerId ? e.imageMarkerId.url : "";
        })
        
        data.companies = arr[0].map((elem) => {
            elem.companyCategoryIds = elem.companyCategoryIds
                .filter((e) => { return (e ? data.category[e.id.toString()] !== undefined : false); })
                .map((e) => e.id.toString())
            return elem;
        })
        
        deferred.resolve(data);
    })
    .catch(console.log)
    
    return deferred.promise;
}

function getCompanyInfo(_id, lang="en") {
    var deferred = Q.defer();
    Q.all([
        service.getById(collectionConst.COMPANIES, _id, lang)
    ]).then(function (arr) {
        let company = arr[0];
        Q.all([
            service.getList(collectionConst.COMPANYCATEGORIES, {_id: company.companyCategoryId}, lang, undefined, {groupId: typeCast.castObjectId("5b062e32dc9753105c38da55")}),
            service.getOne(collectionConst.MAPPROVINCES, {}, lang, {_id: company.address.provinceId})
        ]).then(function (_arr) {
            company.companyCategories = _arr[0].rows.map(e => e.name);
            company.provinceData = _arr[1];
            deferred.resolve(company);
        }).catch(deferred.reject);
    }).catch(deferred.reject);
    return deferred.promise;
}

function getListCompanyInfos (ids, lang="en") {
    var deferred = Q.defer();
    ids = JSON.parse(ids);
    if (Array.isArray(ids)) {
        let promises = ids.map(function (e) {
            return getCompanyInfo(e, lang);
        })
        Q.all(promises)
            .then(function (arr) {
                deferred.resolve(arr);
            })
            .catch(deferred.reject)
    } else {
        deferred.reject();
    }
    return deferred.promise;
}

function getCompanyCategory(platform, page=0, lang="en") {
    var deferred = Q.defer();
    let numRecord = 5;
    page = typeCast.castNumeric(page);
    db[collectionConst.COMPANIES].aggregate([{
            "$unwind": "$companyCategoryId",
        }, {
            "$group": {
                "_id": "$companyCategoryId.id",
                "count": {
                    "$sum": 1
                }
            }
        }, {
            "$sort": {
                "count": -1
            }
        }, {
            "$lookup": {
                "from": collectionConst.COMPANYCATEGORIES,
                "localField": "_id",
                "foreignField": "_id",
                "as": "category"
            }
        }, {
            "$unwind": "$category"
        }, {
            "$project": {
                "count": "$count",
                "_id": "$category._id",
                "group": "$category.groupId",
                "imageId": "$category.imageIconId",
                "data": "$category.data"
            }
        }, {
            "$match": {
                "group": typeCast.castObjectId("5b062e32dc9753105c38da55")
            }
        }, {
            "$group": {
                "_id": null,
                "count": {
                    "$sum": 1
                },
                "rows": {
                    "$push": "$$ROOT"
                }
            }
        }, {
            "$unwind": "$rows"
        }, { 
            "$limit": (page + 1) * numRecord 
        }, { 
            "$skip" : page * numRecord 
        }, {
            "$lookup": {
                "from": collectionConst.LANGS,
                "localField": "rows.data." + lang,
                "foreignField": "_id",
                "as": "rows.data"
            }
        }, {
            "$unwind": "$rows.data"
        }, {
            "$project": {
                "_id": "$rows._id",
                "name": "$rows.data.name",
                "imageId": "$rows.imageId",
                "count": "$count",
                "total": "$rows.count"
            }
        }, {
            "$group": {
                "_id": null,
                "total": {
                    "$first": "$count"
                },
                "rows": {
                    "$push": "$$ROOT"
                }
            }
        }
    ], function (err, arr) {
        if (err) {
            console.log(err);
            deferred.reject(systemConst.query.error)
        } else {
            if (arr.length > 0) {
                let obj = arr[0];
                deferred.resolve(obj);
            } else {
                deferred.resolve({
                    total: 0,
                    rows: []
                });
            }
        }
    })
    return deferred.promise;
}

function updateImageProfile (_id, imageType, imageData) {
    var deferred = Q.defer();
    let image = {
        url: imageData.url
    }
    let arr = image.url.split("/");
    if (arr.length < 1) {
        deferred.reject();
    } else {
        image.name = arr[arr.length - 1];
        let set = {};
        switch (imageType) {
            case "avatar":
                set.avatarImageId = image;
                break;
            case "banner":
                set.coverImageId = image;
                break;
            case "card":
                set.cardVisitImageId = image;
                break;
            default:
                deferred.reject();
                return;
        }
        db.userAccounts.update({_id: typeCast.castObjectId(_id)}, {"$set": set}, function (err, doc) {
            if (err) {
                console.log(err);
                deferred.reject();
            } else {
                deferred.resolve();
            }
        })
    }

    return deferred.promise;
}

function getListName(collection, condition, lang="en", numRecord=3, nonValidateCondition={}) {
    var deferred = Q.defer();

    if (modules[collection]) {
        let aggregateData = [
            {
                "$match": parseCondition(collection, condition, nonValidateCondition)
            }
        ];
        aggregateData.push({"$project": {data: 1, logoImageId: 1, code: 1, _id: 1}});
        aggregateData.push({
            '$group': {
                "_id": null,
                "rows": {
                    '$push': '$$ROOT'
                }
            }
        })
        aggregateData.push({
            '$unwind': "$rows"
        })

        aggregateData.push({ "$limit": numRecord });

        if (modules[collection].multiLang) {
            for (let lang of config.langs) {
                aggregateData.push({
                    "$lookup": {
                        "from": collectionConst.LANGS,
                        "localField": "rows.data." + lang,
                        "foreignField": "_id",
                        "as": "rows.data." + lang
                    }
                });
                aggregateData.push({
                    "$unwind": "$rows.data." + lang
                });
            }
        }
        aggregateData.push({"$group":{"_id": null, "rows": {"$push": "$rows"}}});
        aggregateData.push({"$project": {
            "rows._id": 1,
            "rows.data.vi.name": 1, 
            "rows.data.en.name": 1, 
            "rows.data.vi.url": 1, 
            "rows.data.en.url": 1,
            "rows.logoImageId.url": 1, 
            "rows.code": 1
        }});

        db[collection].aggregate(aggregateData, {allowDiskUse:true}, function(err, arr) {
            if (err) {
                console.log(err);
                deferred.reject(systemConst.query.error)
            } else {
                if (arr.length > 0) {
                    let objs = [];
                    for (let obj of arr[0].rows) {
                        let row = {};
                        let name = typeCast.castSlug(obj.data.en.name).includes(condition.textQuery) ? obj.data.en.name.replace(/\s+/g, ' ') : obj.data.vi.name.replace(/\s+/g, ' ');
                        row.name = name;
                        row._id = obj._id;
                        if (collection == collectionConst.COMPANIES) {
                            row.aUrl = lang == config.langs[0] ? obj.data.en.url : obj.data.vi.url;
                            row.imgUrl = obj.logoImageId.url;
                        } else {
                            if (obj.code != undefined) {
                                let start = typeCast.castSlug(obj.code, " ", false).indexOf(condition.textQuery);
                                let bold = "";
                                if (start != -1) {
                                    bold = obj.code.slice(start, start + condition.textQuery.length);
                                }
                                row.code = obj.code.replace(bold, "<b>" + bold + "</b>");
                            }
                        }
                        
                        let start = typeCast.castSlug(name, " ", false).indexOf(condition.textQuery);
                        let bold = "";
                        if (start != -1) {
                            bold = name.slice(start, start + condition.textQuery.length);
                        }
                        row.text = name.replace(bold, "<b>" + bold + "</b>");

                        objs.push(row);
                    }
                    deferred.resolve(objs);
                } else {
                    deferred.resolve({
                        total: 0,
                        rows: []
                    });
                }
            }
        });
    } else {
        deferred.reject(systemConst.collection.unknown)
    }
    return deferred.promise;
}

function getListNameCompany(condition, lang="en", numRecord=10, nonValidateCondition={}) {
    var deferred = Q.defer();

    if (modules[collectionConst.COMPANIES]) {
        let aggregateData = [
            {
                "$match": parseCondition(collectionConst.COMPANIES, condition, nonValidateCondition)
            }
        ];
        aggregateData.push({"$project": {data: 1, isStore: 1, _id: 1}});
        aggregateData.push({
            '$group': {
                "_id": null,
                "rows": {
                    '$push': '$$ROOT'
                }
            }
        })
        aggregateData.push({
            '$unwind': "$rows"
        })

        aggregateData.push({ "$limit": numRecord });

        if (modules[collectionConst.COMPANIES].multiLang) {
            for (let lang of config.langs) {
                aggregateData.push({
                    "$lookup": {
                        "from": collectionConst.LANGS,
                        "localField": "rows.data." + lang,
                        "foreignField": "_id",
                        "as": "rows.data." + lang
                    }
                });
                aggregateData.push({
                    "$unwind": "$rows.data." + lang
                });
            }
        }
        aggregateData.push({"$group":{"_id": null, "rows": {"$push": "$rows"}}});
        aggregateData.push({"$project": {
            "rows._id": 1,
            "rows.data.vi.name": 1, 
            "rows.data.en.name": 1, 
            "rows.data.vi.url": 1, 
            "rows.data.en.url": 1,
            "rows.isStore": 1
        }});

        db[collectionConst.COMPANIES].aggregate(aggregateData, {allowDiskUse:true}, function(err, arr) {
            if (err) {
                console.log(err);
                deferred.reject(systemConst.query.error)
            } else {
                if (arr.length > 0) {
                    let objs = [];
                    for (let obj of arr[0].rows) {
                        let row = {};
                        row.name = lang == config.langs[0] ? obj.data.en.name : obj.data.vi.name;
                        row._id = obj._id;
                        row.url = lang == config.langs[0] ? obj.data.en.url : obj.data.vi.url;
                        row.isStore = obj.isStore;
                        objs.push(row);
                    }
                    deferred.resolve(objs);
                } else {
                    deferred.resolve({
                        total: 0,
                        rows: []
                    });
                }
            }
        });
    } else {
        deferred.reject(systemConst.collection.unknown)
    }
    return deferred.promise;
}

function getListNamePosition(condition, lang="en", numRecord=10, nonValidateCondition={}) {
    var deferred = Q.defer();

    if (modules[collectionConst.COMPANYPOSITIONS]) {
        let aggregateData = [
            {
                "$match": parseCondition(collectionConst.COMPANYPOSITIONS, condition, nonValidateCondition)
            }
        ];
        aggregateData.push({"$project": {data: 1, _id: 1}});
        aggregateData.push({
            '$group': {
                "_id": null,
                "rows": {
                    '$push': '$$ROOT'
                }
            }
        })
        aggregateData.push({
            '$unwind': "$rows"
        })

        aggregateData.push({ "$limit": numRecord });

        if (modules[collectionConst.COMPANYPOSITIONS].multiLang) {
            for (let lang of config.langs) {
                aggregateData.push({
                    "$lookup": {
                        "from": collectionConst.LANGS,
                        "localField": "rows.data." + lang,
                        "foreignField": "_id",
                        "as": "rows.data." + lang
                    }
                });
                aggregateData.push({
                    "$unwind": "$rows.data." + lang
                });
            }
        }
        aggregateData.push({"$group":{"_id": null, "rows": {"$push": "$rows"}}});
        aggregateData.push({"$project": {
            "rows._id": 1,
            "rows.data.vi.name": 1, 
            "rows.data.en.name": 1, 
        }});

        db[collectionConst.COMPANYPOSITIONS].aggregate(aggregateData, {allowDiskUse:true}, function(err, arr) {
            if (err) {
                console.log(err);
                deferred.reject(systemConst.query.error)
            } else {
                if (arr.length > 0) {
                    let objs = [];
                    for (let obj of arr[0].rows) {
                        let row = {};
                        row.name = lang == config.langs[0] ? obj.data.en.name : obj.data.vi.name;
                        row._id = obj._id;
                        objs.push(row);
                    }
                    deferred.resolve(objs);
                } else {
                    deferred.resolve({
                        total: 0,
                        rows: []
                    });
                }
            }
        });
    } else {
        deferred.reject(systemConst.collection.unknown)
    }
    return deferred.promise;
}

function getListSearch(collection, condition, lang="en", numRecord=3, nonValidateCondition={}) {
    var deferred = Q.defer();
    let promises = [
        getListName(collection.companies, {textQuery: condition}, lang, numRecord),
        getListName(collection.codeVns, {textQuery: condition}, lang, numRecord),
        getListName(collection.codeSics, {textQuery: condition}, lang, numRecord),
        getListName(collection.codeNaics, {textQuery: condition}, lang, numRecord),
        getListName(collection.companyCategories, {textQuery: condition}, lang, numRecord),
    ];
    Q.all (promises)
        .then(function (arr) {
            deferred.resolve({companies: arr[0], codeVns: arr[1], codeSics: arr[2], codeNaics: arr[3], companyCategories: arr[4], keySearch: condition});
        })
        .catch (function (err) {
            next();
        });
        
    return deferred.promise;
}

function getProvinceGeometry(lang="en") {
    var deferred = Q.defer();
    if (!db[collectionConst.PROVINCECITIES])
        db.bind(collectionConst.PROVINCECITIES);

    db[collectionConst.PROVINCECITIES].aggregate([
        {
            "$match": {
                isDelete: false,
                isActive: true
            }
        }, {
            "$project": {
                "area": "$totalArea",
                "population" : "$population",
                "provinceId": "$provinceId",
                "logo": "$logoImageId.url",
                "data": "$data." + lang
            }
        }, {
            "$lookup": {
                "from": collectionConst.LANGS,
                "localField": "data",
                "foreignField": "_id",
                "as": "data"
            }
        }, {
            "$unwind": "$data"
        }, {
            "$project": {
                "name": "$data.name",
                "url" : "$data.url",
                "area": "$area",
                "population" : "$population",
                "provinceId": "$provinceId",
                "logo": "$logo",
            }
        }, {
            "$lookup": {
                "from": collectionConst.MAPPROVINCES,
                "localField": "provinceId",
                "foreignField": "_id",
                "as": "mapProvinceData"
            }
        }, {
            "$unwind": "$mapProvinceData"
        }, {
            "$project": {
                "name": "$name",
                "url" : "$url",
                "area": "$area",
                "population" : "$population",
                "geometry": "$mapProvinceData.geometry",
                "logo": "$logo",
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

function getIndustrialParkGeometry(lang="en") {
    var deferred = Q.defer();
    if (!db[collectionConst.INDUSTRIALPARKS])
        db.bind(collectionConst.INDUSTRIALPARKS);

    db[collectionConst.INDUSTRIALPARKS].aggregate([
        {
            "$match": {
                isDelete: false,
                isActive: true
            }
        }, {
            "$project": {
                "area": "$area",
                "address" : "$address",
                "nganhNgheTiepNhan": "$nganhNgheTiepNhan",
                "data": "$data." + lang,
                "geometry" : "$geometry",
                "logo": "$logoImageId.url",
            }
        }, {
            "$lookup": {
                "from": collectionConst.LANGS,
                "localField": "data",
                "foreignField": "_id",
                "as": "data"
            }
        }, {
            "$unwind": "$data"
        }, {
            "$project": {
                "name": "$data.name",
                "url" : "$data.url",
                "latLng": "$address.latLng",
                "districtId": "$address.districtId",
                "provinceId": "$address.provinceId",
                "area": "$area",
                "nganhNgheTiepNhan": "$nganhNgheTiepNhan",
                "geometry" : "$geometry",
                "logo": "$logo"
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

function getAssociations(lang="en") {
    var deferred = Q.defer();
    if (!db[collectionConst.ASSOCIATIONS])
        db.bind(collectionConst.ASSOCIATIONS);

    db[collectionConst.ASSOCIATIONS].aggregate([
        {
            "$match": {
                isDelete: false,
                isActive: true
            }
        }, {
            "$project": {
                "address" : "$address",
                "logo": "$logoImageId.url",
                "data": "$data." + lang
            }
        }, {
            "$lookup": {
                "from": collectionConst.LANGS,
                "localField": "data",
                "foreignField": "_id",
                "as": "data"
            }
        }, {
            "$unwind": "$data"
        }, {
            "$project": {
                "name": "$data.name",
                "url" : "$data.url",
                "latLng": "$address.latLng",
                "districtId": "$address.districtId",
                "provinceId": "$address.provinceId",
                "area": "$area",
                "logo": "$logo",
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

function getCompanyNames(ids, lang="en") {
    let deferred = Q.defer();

    db[collectionConst.COMPANIES].aggregate([
        {
            "$match": {
                "isDelete": false,
                "isActive": true,
                "_id": {
                    "$in": ids.map(e => typeCast.castObjectId(e))
                }
            }
        }, {
            "$lookup": {
                "from": collectionConst.LANGS,
                "localField": "data." + lang,
                "foreignField": "_id",
                "as": "data"
            }
        }, {
            "$unwind": "$data"
        },
        {"$unwind":{path: "$companyCategoryId", preserveNullAndEmptyArrays: true }},
        {"$lookup":{"from":"ep_companyCategories","localField":"companyCategoryId.id","foreignField":"_id","as":"companyCategoryId"}},
        {"$unwind": {path: "$companyCategoryId", preserveNullAndEmptyArrays: true }},
        {"$group": {
            _id: "$_id", 
            name: {$first: "$data.name"},
            url: {$first: "$data.url"},
            rows: {$push: {
                    _id: "$companyCategoryId._id",
                    logo: "$companyCategoryId.imageMarkerId.url",
                    group: "$companyCategoryId.groupId"
                }}
            }
        }, {
            "$project": {
                name: "$name",
                url: "$url",
                rows: {
                    "$filter": {
                        input: "$rows",
                        as: "item",
                        cond: { $eq: [ "$$item.group", typeCast.castObjectId("5b062e32dc9753105c38da55") ] }
                    }
                }
            }
        }
    ], {allowDiskUse: true}, function (err, arr) {
        if (err) {
            deferred.reject(err)
        } else {
            deferred.resolve(arr.map(e => {
                return {
                    _id: e._id,
                    name: e.name,
                    url: e.url,
                    icon: e.rows.map(t => t.logo)[0]
                }
            }));
        }
    })

    return deferred.promise;
}
function getProvinceInfoPopup(id, lang="en") {
    var deferred = Q.defer();
    if (!db[collectionConst.PROVINCECITIES])
        db.bind(collectionConst.PROVINCECITIES);

    Q.all([
        service.getById(collectionConst.PROVINCECITIES, id, lang),
    ]).then(function (arr) {
        let province = arr[0];
        Q.all([
            service.count(collectionConst.COMPANIES, {}, { "address.provinceId" : typeCast.castObjectId(province.provinceId[0]) }),
        ]).then(function (_arr) {
            province.totalCompany = _arr[0].total;
            deferred.resolve(province);
        }).catch(deferred.reject);
    }).catch(deferred.reject);
    return deferred.promise;
}

function getIndustrialParkInfoPopup(id, lang="en") {
    var deferred = Q.defer();
    if (!db[collectionConst.INDUSTRIALPARKS])
        db.bind(collectionConst.INDUSTRIALPARKS);

    service.getById(collectionConst.INDUSTRIALPARKS, id, lang)
    .then(function (arr) {
        if (arr)
            deferred.resolve(arr);
        else
            deferred.reject;
    }).catch(deferred.reject);
    return deferred.promise;
}


module.exports = service;