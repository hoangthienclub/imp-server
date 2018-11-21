const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.COMPANYCUSTOMERS,
    "moduleName": "Customer",
    "fields": [{
            "label": "Company",
            "attr": "companyId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.COMPANIES
        }, {
            "label": "Company Customer",
            "attr": "customerId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.COMPANIES
        }, {
            "label": "Products",
            "attr": "productIds",
            "inputType": "select_lookup",
            "lookupFrom": "products",
            "multi": true,
            "required": false
        }, {
            "label": "Rate (%)",
            "attr": "rate",
            "inputType": "decimal",
            "required": false
        }
    ],
    "lookupField": "name",
    "queryField": ["name"]
}