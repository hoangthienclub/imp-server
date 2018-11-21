let Q = require('q');
let mongo = require('mongoskin');
let config = require('../../config.json');
let db = mongo.db(config.connectionString, { native_parser: true });
const collectionConst = require("../../utils/system.const").COLLECTION;

let devService = require("./dev.service");
let modules = {};
let moduleCfgs = require("../../modules/config").modules;

const inputMultiLangTypes = ["text", "textarea", "texteditor", "url"];
const inputMixedLangs = ["map"];
const inputCheckBefores = ["username", "password"];


function initModule() {
    let promises = [];
    function __init(cfg) {
        db.bind(cfg.collection);
        promises.push(cfg);

        modules[cfg.collection] = {
            attrMultiLangs: cfg.fields.filter(function(e) {
                return inputMultiLangTypes.indexOf(e.inputType) >= 0 || inputMixedLangs.indexOf(e.inputType) >= 0;
            }),
            updates: cfg.fields.filter(function(e) {
                return inputMultiLangTypes.indexOf(e.inputType) < 0 || inputMixedLangs.indexOf(e.inputType) >= 0;
            }),
            checkBefores: cfg.fields.filter(function(e) {
                return inputCheckBefores.indexOf(e.inputType) >= 0;
            }),
            fields: cfg.fields.map(e => e.attr),
            parentField: cfg.fields.find((e) => { return e.parentAttr; }),
            multiLang: cfg.multiLang,
            lookupField: cfg.lookupField,
            queryField: cfg.queryField,
            queryFieldFromAnother: cfg.queryFieldFromAnother,
            quickChecks: cfg.quickChecks.map(e => e.attr),
            featureImage: cfg.fields.find(e => e.inputType == "file" && e.setFeature)
        };
    }
        
    for (let moduleName in moduleCfgs) {
        devService.updateModule(moduleCfgs[moduleName]);
        __init(moduleCfgs[moduleName]);
    }

    Q.all(promises).then(function () {}).catch(function (err) { console.log(err); });
}
initModule();

modules[collectionConst.SITEDOCUMENTS].getDocumentLayout = function (data, perms, userId) {
    let deferred = Q.defer();
    let role = roleValidate.checkPerm(perms, collectionConst.SITEDOCUMENTS, roleValidate.ACTION.VIEW);
    if (role != roleValidate.PERMS.NO_PERM) {
        service.getById(collectionConst.SITEDOCUMENTS, data._id, userId, role == roleValidate.PERMS.ADMIN)
            .then(function (option) {
                let promises = [
                ];
                Q.all(promises)
                    .then(function (arr) {
                        ejs.renderFile('views/partials/document.ejs', {
                            data: option.data[langs[0]],
                            collection: collectionConst.SITEDOCUMENTS
                        }, function(err, html){
                            if (err) {
                                deferred.reject(err);
                            } else {
                                deferred.resolve(html);
                            }
                        });
                    })
                    .catch (function (err) {
                        deferred.reject(err);
                    });
            })
            .catch(function (err) {
                deferred.reject(err);
            })
    } else {
        deferred.reject(roleValidate.missPermMsg);
    }
    return deferred.promise;
}

module.exports = { modules, db, inputMultiLangTypes };