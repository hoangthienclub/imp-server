const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.COMPANYSALES,
    "moduleName": "Sale",
    "fields": [{
            "label": "Company",
            "attr": "companyId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.COMPANIES
        }, {
            "label": "Type",
            "attr": "type",
            "inputType": "text"
        }, {
            "label": "Country",
            "attr": "countryId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.MAPCOUNTRIES,
            "required": false
        }, {
            "label": "Rate (%)",
            "attr": "rate",
            "inputType": "decimal",
            "required": false
        }, {
            "label": "Year",
            "attr": "year",
            "inputType": "number",
            "required": false
        }
    ],
    "lookupField": "type",
    "queryField": ["type"]
}