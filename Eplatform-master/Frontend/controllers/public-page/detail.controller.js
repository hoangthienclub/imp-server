var MyRender = require("../__render.controller");
var systemService = require("../../services/api/system.service");
var searchService = require("../../services/search.service");
var config = require('../../config.json');
const typeCast = require("../../utils/type.cast");
const treeMenu = require("../../utils/url.util").treeMenu;
const collectionConst = require("../../utils/system.const").COLLECTION;
var Q = require("q");

function getCustomer(companyId, lang) {
    var deferred = Q.defer();
    var data = {};

    let promises3 = [
        systemService.getList(collectionConst.COMPANYCUSTOMERS, { "companyId" : typeCast.castObjectId(companyId) }, lang)   
    ]
    Q.all (promises3)
        .then (function(arr) {
            let promises4 = [];
            arr[0].rows.forEach(function(e) {
                promises4.push(systemService.getOne(collectionConst.COMPANIES, {}, lang, { "_id" : e.customerId[0] }));
            })
            Q.all (promises4)
                .then (function(data) {
                    deferred.resolve(data);
                })
                .catch (function(err) {
                    console.log(err);
                    deferred.reject([])
                })
        })
        .catch (function(err) {
            console.log(err);
            deferred.reject([])
        })
    
    return deferred.promise;
}

function getSupplier(companyId, lang) {
    var deferred = Q.defer();
    var data = {};

    let promises3 = [
        systemService.getList(collectionConst.COMPANYSUPPLIERS, { "companyId" : typeCast.castObjectId(companyId) }, lang)   
    ]
    Q.all (promises3)
        .then (function(arr) {
            let promises4 = [];
            arr[0].rows.forEach(function(e) {
                promises4.push(systemService.getOne(collectionConst.COMPANIES, {}, lang, { "_id" : e.supplierId[0] }));
            })
            Q.all (promises4)
                .then (function(data) {
                    deferred.resolve(data);
                })
                .catch (function(err) {
                    console.log(err);
                    deferred.reject([])
                })
        })
        .catch (function(err) {
            console.log(err);
            deferred.reject([])
        })
    
    return deferred.promise;
}

function getSimilarity(_id, lang="en") {
    var deferred = Q.defer();
    if (true) {
        deferred.resolve({
            rows: []
        });
    } else {
        searchService.similarity(_id.toString())
            .then(function (arr) {
                    systemService.getList(collectionConst.COMPANIES, {}, lang, 10)
                        .then(function (obj) {
                            let promises = [];
                            promises.push(systemService.getList(collectionConst.COMPANYCATEGORIES, {
                                _id: [].concat.apply([], obj.rows.map(e => {
                                    return e.companyCategoryId;
                                }))
                            }, lang, undefined, { groupId: typeCast.castObjectId("5b062e32dc9753105c38da55") }));

                            promises.push(systemService.getList(collectionConst.MAPPROVINCES, {_id: [].concat.apply([], obj.rows.map(e => {
                                return e.address.provinceId;
                            }))}, lang))
                            Q.all(promises)
                                .then(function (arr) {
                                    for (let e in obj.rows) {
                                        obj.rows[e].companyCategoryId = obj.rows[e].companyCategoryId.map(e => e.toString());
                                    }
                                    for (let e in obj.rows) {
                                        obj.rows[e].categories = arr[0].rows.filter(f => {
                                            return obj.rows[e].companyCategoryId && obj.rows[e].companyCategoryId.indexOf(f._id.toString()) >= 0;
                                        });
                                        obj.rows[e].provinceData = arr[1].rows.find(f => {
                                            return obj.rows[e].address.provinceId && obj.rows[e].address.provinceId.toString() == f._id.toString();
                                        });
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
                })
            .catch(function (err) {
                console.log(err);
                deferred.resolve([]);
            })
    }
    return deferred.promise;
}

function getCertificate(companyId, lang) {
    var deferred = Q.defer();
    var data = {};

    let promises3 = [
        systemService.getList(collectionConst.COMPANYCERTIFICATES, { "companyId" : typeCast.castObjectId(companyId) }, lang)   
    ]
    Q.all (promises3)
        .then (function(arr) {
            let promises4 = [];
            arr[0].rows.forEach(function(e) {
                promises4.push(systemService.getOne(collectionConst.COMPANYQUALITYCERTIFICATES, {}, lang, { "_id" : e.companyQualityCertificateId[0] }));
            })
            Q.all (promises4)
                .then (function(data) {
                    for (var i = 0; i < arr[0].rows.length; i++) {
                        arr[0].rows[i].companyQualityCertificate = data[i].name;
                        arr[0].rows[i].imageCertificate = data[i].imageId.url;
                    }
                    deferred.resolve(arr[0]);
                })
                .catch (function(err) {
                    console.log(err);
                    deferred.reject([])
                })
        })
        .catch (function(err) {
            console.log(err);
            deferred.reject([])
        })
    
    return deferred.promise;
}

function getCompanyData(url, lang) {
    var deferred = Q.defer();
    let data = {};
    let promises = [
        systemService.getByUrl(collectionConst.COMPANIES, url, lang)
    ]
    Q.all (promises)
        .then (function(arr) {
            data = arr[0];
            let promises2 = [
                systemService.getList(collectionConst.COMPANYCATEGORIES, { "_id" : arr[0].companyCategoryId }, lang, undefined, { "groupId": typeCast.castObjectId("5b062e32dc9753105c38da55")}),
                systemService.getOne(collectionConst.INDUSTRIALPARKS, {}, lang, { "_id" : arr[0].industrialParkId[0] }),
                systemService.getOne(collectionConst.ASSOCIATIONS, {}, lang, { "_id" : arr[0].associationId[0] }),
                systemService.getOne(collectionConst.MAPCOUNTRIES, {}, lang, { "_id" : arr[0].address.countryId }),
                systemService.getOne(collectionConst.PROVINCECITIES, {}, lang, {"provinceId" : arr[0].address.provinceId}),
                systemService.getOne(collectionConst.MAPDISTRICTS, {}, lang, { "_id" : arr[0].address.districtId }),
                systemService.getOne(collectionConst.COMPANYLEGALSTRUCTURES, {}, lang, { "_id" : arr[0].companyLegalStructureId[0] }),
                systemService.getOne(collectionConst.COMPANYTYPES, {}, lang, { "_id" : arr[0].companyTypeId[0] }),
                systemService.getOne(collectionConst.COMPANYBUSINESSTYPES, {}, lang, { "_id" : arr[0].companyBusinessTypeId }),
                systemService.getOne(collectionConst.MAPCOUNTRIES, {}, lang, { "_id" : arr[0].originalNationalityId }),  
                // systemService.getList("codeTags", { "_id" : arr[0].codeTagIds }, lang, undefined),
                {rows: []},
                getCustomer(arr[0]._id, lang),
                getSupplier(arr[0]._id, lang),
                // systemService.getList(collectionConst.COMPANYCUSTOMERS, { "companyId" : arr[0]._id }, lang),   
                // systemService.getList(collectionConst.COMPANYSUPPLIERS, { "companyId" : arr[0]._id }, lang), 
                systemService.getList(collectionConst.COMPANYPRODUCTS, { "companyId" : arr[0]._id }, lang),  
                systemService.getList(collectionConst.COMPANYPURCHASINGS, { "companyId" : arr[0]._id }, lang),
                systemService.getList(collectionConst.COMPANYSALES, { "companyId" : arr[0]._id }, lang),         
                getCertificate(arr[0]._id, lang),
                // systemService.getList(collectionConst.COMPANYCERTIFICATES, { "companyId" : arr[0]._id }, lang),
                // getSimilarity(arr[0]._id, lang),
                {rows: []},
                systemService.getOne(collectionConst.MAPPROVINCES, {}, lang, { "_id" : arr[0].address.provinceId }),
                systemService.getList(collectionConst.CODENAICS, { "_id" : arr[0].codeNaicsIds }, lang, undefined),
                systemService.getList(collectionConst.CODESICS, { "_id" : arr[0].codeSicIds }, lang, undefined),
                systemService.getList(collectionConst.CODEVNS, { "_id" : arr[0].codeVnIds }, lang, undefined),
                systemService.getList(collectionConst.COMPANYNEWS, { "companyId" : arr[0]._id }, lang),  
                systemService.getList(collectionConst.COMPANYJOBS, { "companyId" : arr[0]._id }, lang)
            ]
            
            Q.all(promises2)
                .then (function(array) {
                    data.categoryData = array[0];
                    data.industrialParkData = array[1];
                    data.associationData = array[2];
                    data.countryData = array[3];
                    data.provinceData = array[4];
                    data.districtData = array[5];
                    data.legalStructureData = array[6];
                    data.companyTypeData = array[7];
                    data.businessTypeData = array[8];
                    data.originalNationalityData = array[9];
                    data.codeTagData = array[10];
                    data.customerData = array[11];
                    data.supplierData = array[12];
                    data.productData = array[13];
                    data.purchasingData = array[14];
                    data.saleData = array[15]; 
                    data.certificateData = array[16];
                    data.companies = array[17].rows;
                    data.provinceName = array[18];
                    data.codeNaicsData = array[19];
                    data.codeSicData = array[20];
                    data.codeVnData = array[21];
                    data.newsData = array[22];
                    array[23].rows.forEach(element => {
                        element.subJobDescription =  element.jobDescription.split(".")[0];
                    });
                    data.jobs = array[23];
                    obj = Object.assign(data);
                    deferred.resolve(data);
                })
                .catch (function(err) {
                    console.log("#", err);
                    deferred.reject([])
                })
        })
        .catch (function (err) {
            console.log(err);
        })
    return deferred.promise;
}

function Controller (req, res, next) {
    console.log("Request: ", new Date());
    let url = "";
    for (lang of config.langs) {
        try {
            url = req.path.match(treeMenu.detail[lang].regex)[treeMenu.detail[lang].param.url];
            break;
        } catch (ex) {
            console.log(ex);
        };
    }
    console.log(url);
    let promises = [
        getCompanyData(url, req.language)
    ]
    Q.all (promises)
        .then(function (obj) {
            console.log("Res: ", new Date());
            MyRender(req, res, "detail", obj[0]);
        })
        .catch(function(err){
            console.log(err);
            next();
        })
}
module.exports = { GET: Controller };