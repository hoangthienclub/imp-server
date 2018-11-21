var systemService = require("../../services/api/system.service");
var siteService = require("../../services/site.service");
var typeCast = require("../../utils/type.cast");
var MyRender = require("../__render.controller");
var Q = require("q");
const collectionConst = require("../../utils/system.const").COLLECTION;

// function getPartner(lang) {
//     var deferred = Q.defer();

//     let promises = [
//         systemService.getList(collectionConst.PARTNERS, {}, lang)
//     ]
//     Q.all (promises)
//         .then (function(arr) {
//             systemService.getList(collectionConst.COMPANIES, {"_id" : arr[0].rows[0].companyPartnerIds}, lang)
//                 .then(function (data) {
//                     deferred.resolve(data);
//                 })  
//                 .catch(function (err) {
//                     deferred.reject([]);
//                 }) 
//         })
//         .catch (function (err) {
//             console.log(err);
//         })

//     return deferred.promise;
// }

// function getCustomer(lang) {
//     var deferred = Q.defer();

//     let promises = [
//         systemService.getList(collectionConst.PARTNERS, {}, lang)
//     ]
//     Q.all (promises)
//         .then (function(arr) {
//             systemService.getList(collectionConst.COMPANIES, {"_id" : arr[0].rows[0].companyCustomerIds}, lang)
//                 .then(function (data) {
//                     deferred.resolve(data);
//                 })  
//                 .catch(function (err) {
//                     deferred.reject([]);
//                 }) 
//         })
//         .catch (function (err) {
//             console.log(err);
//         })

//     return deferred.promise;
// }

function Controller (req, res, next) {
    var data = {};
    let promises = [
        systemService.getList(collectionConst.ABOUTUSES, {}, req.language),     
        systemService.getList(collectionConst.DASHBOARDS, {"Position" : "1"}, req.language, undefined, {}, { "Index": 1 }),
        systemService.getList(collectionConst.DASHBOARDS, {"Position" : "2"}, req.language, undefined, {}, { "Index": 1 }),
        systemService.getList(collectionConst.CUSTOMERREVIEWS, {}, req.language),
        systemService.getCompanyCategory(req.platform, 0, req.language),
        systemService.getList(collectionConst.PARTNERNEWS, {}, req.language),
        systemService.getList(collectionConst.COMPANIES, {}, req.language, 40, {"isCheckLogo" : true}),
        // getPartner(req.language),
        // getCustomer(req.language),
        systemService.count(collectionConst.COMPANIES, {}),
        systemService.count(collectionConst.COMPANYCATEGORIES, {groupId: "5b062e32dc9753105c38da55"}),
        systemService.countDistinct(collectionConst.COMPANIES, "industrialParkId"),
        siteService.countSearch(),
        siteService.countCountry()
    ]
    Q.all (promises)
        .then(function (arr) {
            data.aboutUsData = arr[0].rows;
            data.dashboardBusinessData = arr[1].rows;       
            data.dashboardWebsiteData = arr[2].rows;                             
            data.customerReviewData = arr[3].rows;
            data.companyCategories = arr[4].rows;
            data.partnerData = arr[5].rows;
            data.customerData = arr[6].rows;
            data.dashboardBusinessData[0].value = arr[7].total;
            data.dashboardBusinessData[1].value = arr[8].total;
            data.dashboardBusinessData[2].value = arr[9].total;      
            data.dashboardBusinessData[3].value = parseInt(arr[7].total / 45);
            data.totalSearch = arr[10];
            data.totalCountry = arr[11];
            MyRender(req, res, "home", data);
        })
        .catch(function(err){
            console.log(err);
            next();
        })
}
module.exports = { GET: Controller };