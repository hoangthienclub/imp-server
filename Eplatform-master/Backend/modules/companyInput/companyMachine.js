const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.COMPANYMACHINES,
    "moduleName": "Machine",
    "fields": [{
            "label": "Company",
            "attr": "companyId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.COMPANIES
        }, {
            "label": "Machine's name",
            "attr": "name",
            "inputType": "text"
        }, {
            "label": "Quantity",
            "attr": "quantity",
            "inputType": "number",
            "required": false
        }, {
            "label": "Manufacturer",
            "attr": "manufacturerId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.COMPANIES,
            "required": false
        }, {
            "label": "Country",
            "attr": "countryId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.MAPCOUNTRIES,
            "required": false
        }
    ],
    "lookupField": "name",
    "queryField": ["name"]
}