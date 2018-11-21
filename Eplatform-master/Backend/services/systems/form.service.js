let _ = require('lodash');
let bcrypt = require('bcryptjs');
let Q = require('q');
let config = require('../../config.json');
let ejs = require("ejs");
let langService = require('../lang.service');
let langs = langService.langs;
let logService = require("./log.service");
let typeCast = require("../../utils/type.cast");
let roleValidate = require("../../utils/role.validate");
let collectionConst = require("../../utils/system.const").COLLECTION;

let moduleProvider = require("./module.provider");
let modules = moduleProvider.modules;
let db = moduleProvider.db;
const inputMultiLangTypes = moduleProvider.inputMultiLangTypes;

// 
var service = {};

service.getOne = getOne;
service.save = save;
service.getById = getById;
service.update = update;
service.updateQuickCheck = updateQuickCheck;
service.updateFeatureImage = updateFeatureImage;
service.getPage = getPage;
service.lookup = lookup;
service.delete = _delete;
service.call = call;

module.exports = service;

/**
 * Ép kiểu { data } do nhân viên gửi lên sang định dạng tương ứng với cấu trúc của { collection }.
 * @param {string} collection Tên collection
 * @param {object} data Dữ liệu cần ép kiểu
 */
function castData (collection, data) {
    let recordData = {};
    if (modules[collection].multiLang != false) {
        recordData.data = {}
        langs.forEach(function (lang) {
            recordData.data[lang] = {};
            modules[collection].attrMultiLangs.forEach(function (e) {
                if (e.inputType == "map") {
                    if (data.data && data.data[lang] && data.data[lang][e.attr]) {
                        if (typeof data.data[lang][e.attr] == typeof {}) {
                            recordData.data[lang][e.attr] = {rawAddress: typeCast.castText(data.data[lang][e.attr].rawAddress)};
                        } else {
                            recordData.data[lang][e.attr] = {rawAddress: ""};
                        }
                    }
                } else {
                    if (data.data && data.data[lang] && data.data[lang][e.attr]) {
                        recordData.data[lang][e.attr] = typeCast.castText(data.data[lang][e.attr]);
                    }
                }
            })
        })
    } else {
        modules[collection].attrMultiLangs.forEach(function (e) {
            if (e.inputType == "checkbox") {
                recordData[e.attr] = typeCast.castBool(data[e.attr]);
            } else if (e.inputType == "map") {
                if (typeof data[e.attr] == typeof {}) {
                    recordData[e.attr] = {rawAddress: typeCast.castText(data[e.attr].rawAddress)};
                } else {
                    recordData[e.attr] = {rawAddress: ""};
                }
            } else {
                recordData[e.attr] = typeCast.castText(data[e.attr]);
            }
        })
    }

    
    modules[collection].updates.forEach(function(e) {
        try {
            if (e.inputType == "select_lookup" || e.inputType == "select" || e.inputType == "tag") {
                if (Array.isArray(data[e.attr])) {
                    recordData[e.attr] = data[e.attr].map(function(elem, i) {
                        if (typeof elem == typeof "") {
                            return typeCast.castObjectId(elem);
                        } else if (elem && typeof elem == typeof {}) {
                            return {
                                text: typeCast.castText(elem.text),
                                id: typeCast.castObjectId(elem.id)
                            }
                        }
                    }, this);
                } else {
                    let elem = data[e.attr]
                    if (typeof elem == typeof "") {
                        recordData[e.attr] = typeCast.castObjectId(elem);
                    } else if (elem && typeof elem == typeof {}) {
                        recordData[e.attr] = {
                            text: typeCast.castText(elem.text),
                            id: typeCast.castObjectId(elem.id)
                        }
                    }
                }
            } else if (e.inputType == "file") {
                if (Array.isArray(data[e.attr])) {
                    recordData[e.attr] = data[e.attr].map(function(elem, i) {
                        return typeCast.castFile(elem);
                    }, this);
                } else {
                    recordData[e.attr] = typeCast.castFile(data[e.attr]);
                }
            } else if (e.inputType == "excepts/menu-config") {
                if (Array.isArray(data[e.attr])) {
                    recordData[e.attr] = data[e.attr].map(function(elem, i) {
                        return typeCast.castObjectId(elem);
                    }, this);
                } else {
                    recordData[e.attr] = [];
                }
                recordData[e.attr + "NestableData"] = data[e.attr + "NestableData"];
            } else if (e.inputType == "date") {
                recordData[e.attr] = typeCast.castDate(data[e.attr]);
            } else if (e.inputType == "time") {
                recordData[e.attr] = typeCast.castTime(data[e.attr]);
            } else if (e.inputType == "role") {
                recordData[e.attr] = typeCast.castRole(data[e.attr]);
            } else if (e.inputType == "map") {
                recordData[e.attr] = typeCast.castMap(data[e.attr]);
            } else if (e.inputType == 'password') {
                if (data[e.attr]) {
                    recordData.hash = bcrypt.hashSync(data[e.attr], 10);
                    delete data[e.attr];
                }
            } else if (e.inputType == "number" || e.inputType == "decimal") {
                recordData[e.attr] = typeCast.castNumeric(data[e.attr]);
            } else if (e.inputType == "email" || e.inputType == "tel") {
                if (Array.isArray(data[e.attr])) {
                    if (e.inputType == "email") {
                        recordData[e.attr] = data[e.attr].map(function(elem, i) {
                            return { text: typeCast.castEmail(elem.text) };
                        }, this);
                    } else {
                        recordData[e.attr] = data[e.attr].map(function(elem, i) {
                            return { text: typeCast.castText(elem.text) };
                        }, this);
                    }
                    recordData[e.attr] = recordData[e.attr].filter(function(elem, i) {
                        return elem.text;
                    }, this);
                } else {
                    recordData[e.attr] = [];
                }
            } else if (e.inputType == "json") {
                recordData[e.attr] = typeCast.castJson(data[e.attr]);
            } else if (e.inputType == "checkbox") {
                recordData[e.attr] = typeCast.castBool(data[e.attr]);
            } else {
                if (inputMultiLangTypes.indexOf(e.inputType) < 0) {
                    recordData[e.attr] = typeCast.castText(data[e.attr]);
                }
            }
        } catch (ex) {
            console.log(ex);
            data[e.attr] = undefined;
        }
    }, this);
    return recordData;

}

/**
 * Tính toán mức độ hoàn thành của dữ liệu { recorData } so với kiến trúc { collection }.
 * @param {string} collection Tên collection
 * @param {object} recordData Dữ liệu sau cùng của document
 */
function getCompletionRate(collection, recordData) {
    let bTemp = false;
    if (recordData.data && recordData.data.en) {
        bTemp = true;
    }
    let count  = 0;
    for (let attr of modules[collection].fields) {
        let data = recordData[attr] ? recordData[attr] : (bTemp && recordData.data.en[[attr]] ? recordData.data.en[[attr]] : undefined)
        if (data === undefined || data == [] || data == {} || data == "") {
            count += 1;
        }
    }

    return (1 - count / modules[collection].fields.length) * 100;
}

/**
 * Chuyển đổi thông tin các trường được quy định theo { collection } sang slug để query
 * @param {string} collection Tên collection
 * @param {object} recordData Dữ liệu sau cùng của bản ghi
 */
function getTextQuery(collection, recordData) {
    let textQuery = ""
    let queryFields = Array.isArray(modules[collection].queryField) ? modules[collection].queryField : [modules[collection].queryField]
    
    for (let attr of queryFields) {
        if (recordData[attr]) {
            textQuery += " " + recordData[attr].toString().toLowerCase();
        } else {
            if (recordData.data !== undefined) {
                for (let lang of langs) {
                    if (recordData.data[lang] && recordData.data[lang][attr]) {
                        textQuery += " " + recordData.data[lang][attr].toString().toLowerCase();
                    }
                }
            }
        }
    }
    return typeCast.castSlug(textQuery);
}

/**
 * Kiểm tra trường { e } là thông tin ràng buộc của { collection } trước khi lưu vào database.
 * Nếu không hợp lệ sẽ hủy bỏ thao tác hiện tại.
 * @param {string} collection Tên collection trong database.
 * @param {object} data Dữ liệu người dùng gửi lên.
 * @param {object} e Thông tin cấu hình của trường.
 */
function validateCheckBeforeInputs (collection, data, e) {
    var deferred = Q.defer();
    if (e.inputType == "password") {
        if ((new RegExp("^(.+){8,}$")).test(typeCast.castText(data[e.attr]))) {
            deferred.resolve();
        } else {
            deferred.reject("Weak password");
        }
    } else if (e.inputType == "username") {
        let condition = {};
        condition[e.attr] = typeCast.castText(data[e.attr]);
        if (data._id) {
            condition["_id"] = {"$ne": typeCast.castObjectId(data._id)};
        }

        db[collection].find(condition).toArray(function (err, arr) {
            if (err) {
                deferred.reject("Server error");
            } else {
                if (arr.length > 0) {
                    deferred.reject("Record existed");
                } else {
                    deferred.resolve();
                }
            }
        })
    }
    return deferred.promise;
}

/**
 * Kiểm tra tất cả các trường ràng buộc của { collection } trước khi lưu vào database.
 * Nếu không hợp lệ sẽ hủy bỏ thao tác hiện tại.
 * @param {string} collection Tên collection trong database.
 * @param {object} data Dữ liệu người dùng gửi lên.
 */
function checkInputBefore (collection, data) {
    var deferred = Q.defer();
    if (Array.isArray(modules[collection].checkBefores)){
        let promises = [];
        modules[collection].checkBefores.forEach(function (e) {
            promises.push(validateCheckBeforeInputs(collection, data, e))
        })
        Q.all(promises)
            .then(() => {
                deferred.resolve();
            })
            .catch((err) => {
                deferred.reject(err);
            })
    } else {
        deferred.resolve();
    }
    return deferred.promise;
}

/**
 * Xác định đường dẫn tới trường thông tin được quy định là tên đại diện của bản ghi được 
 * quy định trong cấu hình của { collection }.
 * Giá trị prefix cho phép tùy chỉnh đường dẫn xuất phát
 * @param {string} collection 
 * @param {string} prefix 
 */
function getRecordName(collection, prefix = "") {
    let recordName = undefined;
    let data = prefix + (modules[collection].multiLang == false ? "" : "data.");
    if (Array.isArray(modules[collection].lookupField)) {
        recordName = {
            "$concat": modules[collection].lookupField.map(function (e) { 
                if (typeof e == "object") {
                    if (e.isField == false)
                        return e.attr;
                    return "$" + prefix + e.attr;
                }
                return "$" + data + e; 
            })
        }
    } else {
        recordName = "$" + data + modules[collection].lookupField
    }
    return recordName;
}

// ==================================================== //

/**
 * Lấy về document trong { collection }
 * @param {string} collection 
 * @param {Boolean} asAdmin Bỏ qua việc kiểm tra quyền nếu như asAdmin = true
 */
function getOne(collection, asAdmin = false) {
    var deferred = Q.defer();
    let aggregateData = [{
        "$match": {
            isDelete: false,
            isActive: true
        }
    }];
    
    let project = {};
    
    modules[collection].updates.forEach(function(obj) {
        project[obj.attr] = "$" + obj.attr;
    }, this);

    if (modules[collection].multiLang != false) {
        if (modules[collection].attrMultiLangs.length > 0) {
            langs.forEach(function(lang) {
                aggregateData.push({
                    "$lookup": {
                        from: collectionConst.LANGS,
                        localField: "data." + lang,
                        foreignField: "_id",
                        as: "data." + lang
                    }
                });
                aggregateData.push({
                    "$unwind": "$data." + lang
                });
            }, this);
            
            project.data = "$data";
        }
    }


    aggregateData.push({ "$project": project });
    aggregateData.push({ "$sort": { cre_ts: -1 } });
    aggregateData.push({ "$skip": 0 });
    aggregateData.push({ "$limit": 1 });

    db[collection].aggregate(aggregateData, {allowDiskUse:true}, function(err, rows) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (rows.length > 0) {
            deferred.resolve(_.omit(rows[0], ["isActive", "isDelete"]));
        } else {
            deferred.resolve({});
        }
    });

    return deferred.promise;
}

/**
 * Lưu mới 1 document có thông tin { data } vào { collection }.
 * @param {string} collection Tên collection
 * @param {object} data Thông tin được cung cấp để thực hiện
 * @param {string} userId ObjectId của người thực hiện hành vi trên
 * @param {Boolean} asAdmin Bỏ qua việc kiểm tra quyền nếu như asAdmin = true
 */
function save(collection, data, userId, asAdmin = false) {
    var deferred = Q.defer();

    let recordData = castData(collection, data);
    recordData.cre_ts = new Date();
    recordData.userId = typeCast.castObjectId(userId);
    recordData.isActive = true;
    recordData.isDelete = false;

    Q.all([
        checkInputBefore(collection, data),
    ])
        .then(function(res) {
            let promises = [];
            if (modules[collection].multiLang != false && modules[collection].attrMultiLangs.length > 0 ) {
                langs.forEach(function(lang, i) {
                    if (i > 0) {
                        if (!recordData.data[lang]) {
                            recordData.data[lang] = _.omit(recordData.data[langs[0]], ["_id", "cre_ts", "mod_ts"]);
                        }
                        modules[collection].attrMultiLangs.forEach(function(obj) {
                            if (recordData.data[langs[0]][obj.attr] && !recordData.data[lang][obj.attr]) {
                                recordData.data[lang][obj.attr] = recordData.data[langs[0]][obj.attr];
                            }
                        })
                    }
                    if (recordData.data[lang]) {
                        promises.push(langService.saveLang(recordData.data[lang]));
                    }
                })
            }
        
            Q.all(promises)
                .then(function(langIds) {
                    recordData.completionRate = getCompletionRate(collection, recordData);
                    recordData.textQuery = getTextQuery(collection, recordData);

                    if (modules[collection].attrMultiLangs.length > 0 && recordData.data)
                        Object.keys(recordData.data).forEach(function(key, idx) {
                            recordData.data[key] = langIds[idx].insertedIds[0];
                        });
                        
                    db[collection].insert(recordData, function(err, doc) {
                        if (err) deferred.reject(err);
                        logService.save(roleValidate.ACTION.ADD, collection, doc.insertedIds[0], {}, { insertId: doc.insertedIds[0] });
                        deferred.resolve(doc);
                    });
                })
                .catch(function(err) {
                    console.log(err);
                })
        })
        .catch(function(err) {
            console.log(err);
            deferred.reject(err);
        });

    return deferred.promise;
}

/**
 * Lấy về danh sách document của { collection } theo trang sô { page } kèm điều kiện lọc
 * { filterData }. Chỉ lấy các document do user có { userId } tạo ra nếu { asAdmin } là false và ngược lại
 * @param {string} collection Tên collection
 * @param {string|number} page Trang muốn lấy về
 * @param {object} filterData Điệu kiện lọc
 * @param {string} userId ObjectId của người thực hiện hành vi trên
 * @param {bool} asAdmin Bỏ qua việc kiểm tra quyền nếu như asAdmin = true
 */
function getPage(collection, page, filterData, userId, asAdmin = false) {
    var deferred = Q.defer();
    let numRowPerPage = config.numRowPerPage;
    if (filterData.numRecord) {
        numRowPerPage = typeCast.castNumeric(filterData.numRecord);
        if (filterData.numRecord % 10 == 0 && filterData.numRecord > 0 && filterData.numRecord <= 50) {

        } else {
            numRowPerPage = config.numRowPerPage;
        }
    }

    filterData.name = filterData.name.toString().trim();
    let aggregateData = [{
        "$match": {
            isDelete: false
        }
    }];
    if (filterData.name) {
        aggregateData[0]["$match"].textQuery = new RegExp(typeCast.castText(filterData.name), "ig");
    }
    if (filterData.parentId) {
        if (modules[collection].parentField) {
            aggregateData[0]["$match"][modules[collection].parentField.attr] = typeCast.castObjectId(filterData.parentId);
        }
    }
    let project = {}
    
    if (modules[collection].multiLang == false) {
        if (Array.isArray(modules[collection].lookupField)) {
            for (var e of modules[collection].lookupField) {
                if (typeof e == "string") {
                    project[e] = "$" + e;
                } else if (typeof e == "object" && e.isField != false) {
                    project[e.attr] = "$" + e.attr;
                }
            }
        } else {
            project[modules[collection].lookupField] = "$" + modules[collection].lookupField;
        }
    }
    
    if (Array.isArray(modules[collection].lookupField)) {
        modules[collection].lookupField.forEach(function (e) {
            if (typeof e == "object") {
                if (e.isField !== false) {
                    project[e.attr] = "$" + e.attr;
                }
            } else {
                project[e] = "$" + e;
            }
        })
    }

    if (modules[collection].queryFieldFromAnother) {
        project[modules[collection].queryFieldFromAnother.attr] = "$" + modules[collection].queryFieldFromAnother.attr;
    }
    project.completionRate = "$completionRate";
    project.userId = "$userId";
    project.data = "$data";
    project.cre_ts = "$cre_ts";
    for (var e of modules[collection].quickChecks) {
        project[e] = "$" + e;
    }
    project.mod_ts = "$mod_ts";
    project.textQuery = "$textQuery";
    project.modByUserId = "$modByUserId";
    
    if (modules[collection].featureImage) {
        project.featureImage = "$" + modules[collection].featureImage.attr;
    }

    aggregateData.push({ "$project": project });

    let sortData = {cre_ts: -1};
    if (
        ['_id', 'textQuery', 'completionRate','cre_ts', 'mod_ts', 'userId', 'modByUserId'].indexOf(filterData.sortAttr) >= 0 ||
        modules[collection].quickChecks.indexOf(filterData.sortAttr) >= 0
    ) {
        delete sortData.cre_ts;
        sortData[filterData.sortAttr] = filterData.sortVal == -1 ? -1 : 1;
    }
    
    aggregateData.push({ "$sort": sortData });
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
        '$project': {
            'total': 1,
            'rows': {
                '$slice': ["$rows", page * numRowPerPage, numRowPerPage]
            }
        }
    })

    aggregateData.push({"$unwind": "$rows"});
    project = {};
    if (modules[collection].multiLang != false) {
        if (modules[collection].attrMultiLangs.length > 0) {
            aggregateData.push({
                "$lookup": {
                    from: collectionConst.LANGS,
                    localField: "rows.data." + langs[0],
                    foreignField: "_id",
                    as: "rows.data"
                }
            });
            aggregateData.push({
                "$unwind": "$rows.data"
            });
        }
    }
    if (!modules[collection].queryFieldFromAnother) {
        project.name = getRecordName(collection, "rows.");
        project._id = "$rows._id";
    } else {
        // get lookup info
        aggregateData.push({
            "$lookup": {
                from: modules[collection].queryFieldFromAnother.from,
                localField: "rows." + modules[collection].queryFieldFromAnother.attr + (modules[collection].queryFieldFromAnother.preload === false ? ".id" : ""),
                foreignField: "_id",
                as: "rows.another"
            }
        });
        aggregateData.push({
            "$unwind": {
                path: "$rows.another",
                preserveNullAndEmptyArrays: true
            }
        });
        if (modules[modules[collection].queryFieldFromAnother.from].multiLang !== false) {
            aggregateData.push({
                "$lookup": {
                    from: collectionConst.LANGS,
                    localField: "rows.another.data." + langs[0],
                    foreignField: "_id",
                    as: "rows.another.data"
                }
            });
            aggregateData.push({
                "$unwind": {
                    path: "$rows.another.data",
                    preserveNullAndEmptyArrays: true
                }
            });
        }
        project.anotherName = getRecordName(modules[collection].queryFieldFromAnother.from, "rows.another.");
    }

    
    // get create user info
    aggregateData.push({
        "$lookup": {
            from: collectionConst.USERS,
            localField: "rows.userId",
            foreignField: "_id",
            as: "rows.user"
        }
    });
    aggregateData.push({
        "$unwind": {
            path: "$rows.user",
            preserveNullAndEmptyArrays: true
        }
    });
    
    // get modify user info
    aggregateData.push({
        "$lookup": {
            from: collectionConst.USERS,
            localField: "rows.modByUserId",
            foreignField: "_id",
            as: "rows.editUser"
        }
    });
    aggregateData.push({
        "$unwind": {
            path: "$rows.editUser",
            preserveNullAndEmptyArrays: true
        }
    });

    project.total = "$total";
    project["fullname"] = {
        "$concat": ["$rows.user.firstName", " ", "$rows.user.lastName"]
    }
    project["editFullname"] = {
        "$concat": ["$rows.editUser.firstName", " ", "$rows.editUser.lastName"]
    }
    for (var e of modules[collection].quickChecks) {
        project[e] = "$rows." + e;
    }
    project.modByUserId = "$rows.modByUserId";
    project.completionRate = "$rows.completionRate";
    project.userId = "$rows.userId";
    project.cre_ts = "$rows.cre_ts";
    project.mod_ts = "$rows.mod_ts";
    project._id = "$rows._id";
    if (modules[collection].featureImage) {
        project.featureImage = "$rows.featureImage";
    }
    
    aggregateData.push({ "$project": project });
    aggregateData.push({"$group":{"_id": null, "total": {"$first": "$total"},"rows": {"$push":"$$ROOT"}}})

    
    db[collection].aggregate(aggregateData, {allowDiskUse:true}, function(err, data) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        else {
            if (data.length > 0) {
                deferred.resolve({
                    rows: data[0].rows,
                    count: data[0].total,
                    numRowPerPage: numRowPerPage
                });
            } else {
                deferred.resolve({
                    rows: [],
                    count: 0,
                    numRowPerPage: numRowPerPage
                });
            }

        }
    });

    return deferred.promise;
}

/**
 * Cập nhật thông tin document có { _id } của { collection }, dữ liệu cập nhật là { data }.
 * Trường hợp user { userId } không phải người tạo ra document này thì hành động sẽ bị hủy bỏ trừ khi { asAdmin } bằng true
 * @param {string} collection Tên collection
 * @param {string} _id ObjectID của document muốn update
 * @param {object} data Dữ liệu muốn update
 * @param {string} userId ObjectId của người thực hiện hành vi trên
 * @param {bool} asAdmin Bỏ qua việc kiểm tra quyền nếu như asAdmin = true
 */
function update(collection, _id, data, userId, asAdmin = false) {
    var deferred = Q.defer();
    
    Q.all([
        service.getById(collection, _id),
        checkInputBefore(collection, data),
    ])
        .then(function(res) {
            let recordData = castData(collection, data);
            recordData.modByUserId = typeCast.castObjectId(userId);
            recordData.mod_ts = new Date();

            let promises = [];

            if (modules[collection].multiLang != false) {
                langs.forEach (function (lang, i) {
                    let updateData = _.omit(recordData.data[lang], ["_id", "cre_ts", "mod_ts"]);
                    if (i > 0) {
                        modules[collection].attrMultiLangs.forEach(function(obj) { 
                            if (recordData.data[langs[0]][obj.attr] && !updateData[obj.attr]) {
                                updateData[obj.attr] = recordData.data[langs[0]][obj.attr];
                            }
                        })
                    }
                    promises.push(langService.updateLang(data.data[lang]._id, updateData))
                });
            }
            
            Q.all(promises)
                .then(function (arr) {
                    recordData.completionRate = getCompletionRate(collection, recordData);
                    recordData.textQuery = getTextQuery(collection, recordData);

                    recordData = _.omit(recordData, "data");
                    
                    db[collection].update({
                        _id: typeCast.castObjectId(_id)
                    }, {
                        $set: recordData
                    }, function(err, doc) {
                        if (err) deferred.reject(err);

                        try {
                            let currentData = _.omit(res[0], ["_id", "data", "userId", "cre_ts", "mod_ts", "typeId", "formId", "isActive", "isDelete"])
                            logService.save(roleValidate.ACTION.EDIT, collection, _id, currentData, _.omit(recordData, "mod_ts"));
                        } catch (ex) {
                            console.log(ex);
                        }
                        deferred.resolve(doc);
                    });
                })
                .catch (function (err) {
                    console.log(err);
                });
        })
        .catch(function(err) {
            console.log(err);
            deferred.reject(err);
        })
    return deferred.promise;
}

/**
 * Cập nhật thông tin document có { _id } của { collection }, dữ liệu cập nhật là { data }.
 * Các thông tin có thể cập nhật được quy định trong cấu hình của { collection }
 * Trường hợp user { userId } không phải người tạo ra document này thì hành động sẽ bị hủy bỏ trừ khi { asAdmin } bằng true
 * @param {string} collection Tên collection
 * @param {string} _id ObjectID của document muốn update
 * @param {object} data Dữ liệu muốn update
 * @param {string} userId ObjectId của người thực hiện hành vi trên
 * @param {bool} asAdmin Bỏ qua việc kiểm tra quyền nếu như asAdmin = true
 */
function updateQuickCheck(collection, _id, data, userId, asAdmin = false) {
    var deferred = Q.defer();
    
    let setData = {};
    for (let attr in data) {
        if (modules[collection].quickChecks.indexOf(attr) < 0) {
            deferred.reject("Attr not in quick checks")
        } else {
            setData[attr] = typeCast.castBool(data[attr]);
        }
    }
    Q.all([
    ])
        .then(function(res) {
            let promises = [
                db[collection].update({ _id: typeCast.castObjectId(_id) }, { "$set": setData })
            ];
            Q.all(promises)
                .then(function (arr) {
                    deferred.resolve({status: "OK"})
                })
                .catch (function (err) {
                    console.log(err);
                    deferred.reject("Update error");
                });
        })
        .catch(function(err) {
            console.log(err);
            deferred.reject(err);
        })
    return deferred.promise;
}

/**
 * Cập nhật thông tin document có { _id } của { collection }, dữ liệu cập nhật là { data }.
 * Tham số data là thông tin của 1 bức hình gồm url, path, name. 
 * Hàm dùng để cập nhật nhanh feature image của document
 * Trường hợp user { userId } không phải người tạo ra document này thì hành động sẽ bị hủy bỏ trừ khi { asAdmin } bằng true
 * @param {string} collection Tên collection
 * @param {string} _id ObjectID của document muốn update
 * @param {object} data Dữ liệu muốn update
 * @param {string} userId ObjectId của người thực hiện hành vi trên
 * @param {bool} asAdmin Bỏ qua việc kiểm tra quyền nếu như asAdmin = true
 */
function updateFeatureImage(collection, _id, data, userId, asAdmin = false) {
    var deferred = Q.defer();
    let setData = {};
    
    if (!modules[collection].featureImage) {
        deferred.reject("Module not config feature image")
    } else {
        setData[modules[collection].featureImage.attr] = typeCast.castFile(data);
    }
    
    Q.all([
    ])
        .then(function(res) {
            let promises = [
                db[collection].update({ _id: typeCast.castObjectId(_id) }, { "$set": setData })
            ];
            Q.all(promises)
                .then(function (arr) {
                    deferred.resolve({status: "OK"})
                })
                .catch (function (err) {
                    console.log(err);
                    deferred.reject("Update error");
                });
        })
        .catch(function(err) {
            console.log(err);
            deferred.reject(err);
        })
    return deferred.promise;
}

/**
 * Lấy về document có { _id } của { collection }.
 * Trường hợp user { userId } không phải người tạo ra document này thì hành động sẽ bị hủy bỏ trừ khi { asAdmin } bằng true
 * @param {string} collection Tên collection
 * @param {string} _id ObjectID của document muốn update
 * @param {string} userId ObjectId của người thực hiện hành vi trên
 * @param {bool} asAdmin Bỏ qua việc kiểm tra quyền nếu như asAdmin = true
 */
function getById(collection, _id, userId, asAdmin = false) {
    var deferred = Q.defer();

    aggregateData = [{
        "$match": {
            _id: typeCast.castObjectId(_id),
            isDelete: false
        }
    }];

    if (modules[collection].multiLang != false) {
        langs.forEach(function(lang) {
            aggregateData.push({
                "$lookup": {
                    from: collectionConst.LANGS,
                    localField: "data." + lang,
                    foreignField: "_id",
                    as: "data." + lang
                }
            });
            aggregateData.push({
                "$unwind": "$data." + lang
            });
        }, this);
    } else {

    }

    aggregateData.push({
        "$sort": { mod_ts: -1 }
    });
    aggregateData.push({
        "$skip": 0
    });
    aggregateData.push({
        "$limit": 1
    });
    
    db[collection].aggregate(aggregateData, {allowDiskUse:true}, function(err, rows) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (rows.length > 0) {
            let obj = _.omit(rows[0], ["cre_ts", "mod_ts", "modByUserId", "userId", "hash", "isDelete"])
            deferred.resolve(obj);
        } else
            deferred.reject({});
    })

    return deferred.promise;
}

/**
 * Lấy về danh sách các document của { collection } phù hợp với điều kiện { condition }.
 * Kết quả sẽ được dùng trong selectbox
 * @param {string} collection Tên collection
 * @param {object} condition Điều kiện lọc
 * @param {bool} asAdmin Bỏ qua việc kiểm tra quyền nếu như asAdmin = true
 */
function lookup(collection, condition, asAdmin = false) {
    var deferred = Q.defer();
    if (!modules[collection]) {
        deferred.resolve([]);
        console.log("Error: Unknown collection: ", collection);
        return deferred.promise;
    }
    
    let aggregateData = [{
        "$match": {
            isDelete: false
        }
    }];
    condition.name = condition.name ? condition.name.toString().trim() : "";
    if (condition.parentId) {
        if (modules[collection].parentField.preload == false) {
            aggregateData[0]["$match"][modules[collection].parentField.attr] = { id: typeCast.castObjectId(condition.parentId) };
        } else {
            aggregateData[0]["$match"][modules[collection].parentField.attr] = typeCast.castObjectId(condition.parentId);
        }
    }
    if ([collectionConst.MAPCOUNTRIES, collectionConst.MAPPROVINCES, collectionConst.MAPDISTRICTS].indexOf(collection) >= 0) {
        
    } else {
        if (condition.name) {
            aggregateData[0]["$match"].textQuery = new RegExp(typeCast.castText(condition.name), "ig");
            aggregateData.push({"$limit": 15});
        } else {
            aggregateData.push({"$limit": 10});
        }
    }

    aggregateData.push({"$skip": 0});
    if (collection == "tags") {
        for (var e in condition) {
            if (e == "collection") {
                aggregateData[0]["$match"]["collection"] = typeCast.castText(condition["collection"]);
                break;
            }
        }
    }

    let project = {};

    if (modules[collection].multiLang != false) {
        if (modules[collection].attrMultiLangs.length > 0) {
            let defaultLang = langs[0];
            aggregateData.push({
                "$lookup": {
                    from: collectionConst.LANGS,
                    localField: "data." + defaultLang,
                    foreignField: "_id",
                    as: "data"
                }
            });
            aggregateData.push({
                "$unwind": "$data"
            });
        }
    }
    
    project["name"] = getRecordName(collection);
    aggregateData.push({
        "$project": project
    });

    db[collection].aggregate(aggregateData, {allowDiskUse:true}, function(err, rows) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (rows) {
            deferred.resolve(rows);
        } else {
            deferred.resolve([]);
        }
    });

    return deferred.promise;
}

/**
 * Xóa document có { _id } trong { collection }
 * Trường hợp user { userId } không phải người tạo ra document này thì hành động sẽ bị hủy bỏ trừ khi { asAdmin } bằng true
 * @param {string} collection Tên collection
 * @param {*} _id ObjectId của document cần xóa
 * @param {*} userId ObjectId của người thực hiện
 * @param {*} asAdmin Bỏ qua việc kiểm tra quyền nếu như asAdmin = true
 */
function _delete(collection, _id, userId, asAdmin = false) {
    var deferred = Q.defer();

    db[collection].findById(_id, function(err, row) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (row) {
            if (row.userId == userId || asAdmin) {
                remove();
            } else {
                deferred.reject(roleValidate.missPermMsg);
            }
        } else {
            deferred.reject("Not found");
        }
    })

    function remove() {
        db[collection].update({ _id: typeCast.castObjectId(_id) }, { $set: { isDelete: true, modByUserId: typeCast.castObjectId(userId) } }, function(err, doc) {
            deferred.resolve();
        });
    }
    return deferred.promise;
}

/**
 * Gọi 1 function đã được collection đăng ký với hệ thống. Function sẽ tự kiểm tra quyền cũng như trả lợi lại request
 * @param {string} collection Tên collection
 * @param {callback} fn Tên hàm đã đăng ký với hệ thống tương ứng với collection
 * @param {object} data Dữ liệu sẽ được truyền vào callback
 * @param {object} perms Các quyền của người thực hiện
 * @param {string} userId ObjectId của người thực hiện
 */
function call(collection, fn, data, perms, userId) {
    try {
        var func = modules[collection][fn];
        return func(data, perms, userId)
    } catch (ex) {
        console.log(ex);
        console.log(collection, fn);
    }
}