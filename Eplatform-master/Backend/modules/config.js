const collectionConst = require("../utils/system.const").COLLECTION;
let moduleConfigs = [
    "./websiteSetting/menu",
    "./websiteSetting/nav",
    "./websiteSetting/setting",
    "./websiteSetting/unit",
    "./websiteSetting/unitType",
    "./websiteManagement/userAccount",
    "./websiteManagement/partner",
    "./websiteManagement/partnerNew",
    "./websiteManagement/customerReview",
    "./websiteManagement/contact",
    "./websiteManagement/subscribe",
    "./websiteManagement/dashboardType",
    "./websiteManagement/dashboard",
    "./websiteManagement/faq",
    "./websiteManagement/term",
    "./websiteManagement/aboutUs",
    "./systemCategory/companyLegalStructure",
    "./systemCategory/companyQualityCertificate",
    "./systemCategory/companyPosition",
    "./systemCategory/companyDegree",
    "./systemCategory/companyDepartment",
    "./systemCategory/companyType",
    "./systemCategory/companyBusinessType",
    "./systemCategory/companyGroupCategory",
    "./systemCategory/companyCategory",
    "./systemCategory/tag",
    "./systemCategory/keyword",
    "./systemCategory/locationType",
    "./staffAccount/staffAccount",
    "./mapLocation/mapDistrict",
    "./mapLocation/mapProvince",
    "./mapLocation/mapCountry",
    "./mapLocation/mapGroup",
    "./mapLocation/mapPlace",
    "./mapLocation/mapRegion",
    "./mapLocation/specialZone",
    "./IPAssociationProvince/industrialPark",
    "./IPAssociationProvince/association",
    "./IPAssociationProvince/provinceCity",
    "./fileManagement/siteDocument",
    "./codeNumber/codeSic",
    "./codeNumber/codeNaic",
    "./codeNumber/codeVn",
    "./codeNumber/codeNso",
    "./codeNumber/codeTag",
    "./codeNumber/productCode",
    "./codeNumber/codeRelation",
    "./companyInput/company",
    "./companyInput/companyProduct",
    "./companyInput/companyCertificate",
    "./companyInput/companyShareholder",
    "./companyInput/companyCustomer",
    "./companyInput/companySupplier",
    "./companyInput/companyContact",
    "./companyInput/companySale",
    "./companyInput/companyPurchasing",
    "./companyInput/companyNew",
    "./companyInput/companyFacility",
    "./companyInput/companyMachine",
    "./companyInput/companyRole",
    "./companyInput/companyEvent",
    "./companyInput/companyJob",
    "./companyInput/companyPromotion"
]
const formAction = "Form";

let modules = {};

function formatModule(moduleConfig) {
    moduleConfig.model = "modelData";
    moduleConfig.routes = {
        "add": "index." + moduleConfig.collection + formAction + ".add",
        "more": [{
            "route": "index." + moduleConfig.collection + formAction + ".edit({_id: row._id, parentId: vm.ft.parentId})", "label": "Edit", "icon": "fa-pencil-square", "aIcon": "btn-warning"
        }]
    }
    moduleConfig.editRoute = "index." + moduleConfig.collection + formAction + ".edit";
    return moduleConfig;
}

moduleConfigs.forEach(function (path) {
    let moduleConfig = require(path);
    modules[moduleConfig.collection] = formatModule(moduleConfig);
}, this);


function getRoleConfig(modules) {
    // Role module
    let rolesConfig = {
        "collection": collectionConst.ROLES,
        "record": "role",
        "moduleName": "Role",
        "fields": [{
            "label": "Role",
            "attr": collectionConst.ROLES,
            "inputType": "role"
        }],
        "multiLang": false,
        "lookupField": "name",
        "queryField": ["name"]
    }
    for (var collection in modules) {
        rolesConfig.fields.push({
            "label": modules[collection].moduleName,
            "attr": collection,
            "inputType": "role"
        });
    }
    rolesConfig.fields.sort(function (a, b) {
        return a.label.localeCompare(b.label);
    });
    rolesConfig.fields.unshift({
        "label": "Role name",
        "attr": "name",
        "inputType": "text"
    });

    return rolesConfig;
}
modules[collectionConst.ROLES] = formatModule(getRoleConfig(modules))



// 
for (let collection in modules) {
    if (Array.isArray(modules[collection].childCollections)) {
        modules[collection].childCollections = modules[collection].childCollections.map(function(e) {
            if (!modules[e]) {
                console.log(e);
            }
            let field = modules[e].fields.find((field) => {
                return field.lookupFrom == modules[collection].collection;
            });
            field.parentAttr = true;
            field.editRoute = modules[collection].editRoute;
            return {
                collection: modules[e].collection,
                label: modules[e].moduleName
            }
        })
    }
    
    if (!Array.isArray(modules[collection].quickChecks)) {
        modules[collection].quickChecks = [];
    }
    
    modules[collection].quickChecks = [
        {
            "label": "Active",
            "attr": "isActive"
        }
    ].concat(modules[collection].quickChecks)
    
    modules[collection].featureImage = modules[collection].fields.find(e => e.inputType == "file" && e.setFeature);
    modules[collection].submit = "vm.Save()";
}

let service  = {}



module.exports = { modules: modules, formAction: formAction };