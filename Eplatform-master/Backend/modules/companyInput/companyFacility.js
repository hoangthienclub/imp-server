const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.COMPANYFACILITIES,
    "moduleName": "Facilities",
    "fields": [{
            "label": "Company",
            "attr": "companyId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.COMPANIES
        }, {
            "label": "Business Type",
            "attr": "companyBusinessTypeId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.COMPANYBUSINESSTYPES
        }, {
            "label": "Area (m2)",
            "attr": "area",
            "inputType": "decimal",
            "required": false
        }, {
            "label": "Occupation Type",
            "attr": "occupationType",
            "inputType": "text",
            "required": false
        }, {
            "label": "Location Type",
            "attr": "locationTypeId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.LOCATIONTYPES,
            "required": false
        }
    ],
    "lookupField": "name",
    "queryField": ["name"]
}