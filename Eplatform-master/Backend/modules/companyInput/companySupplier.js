const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.COMPANYSUPPLIERS,
    "moduleName": "Supplier",
    "fields": [{
            "label": "Company",
            "attr": "companyId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.COMPANIES
        }, {
            "label": "Company Supplier",
            "attr": "supplierId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.COMPANIES
        }, {
            "label": "Products",
            "attr": "productIds",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.COMPANYPRODUCTS,
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
    "multiLang": false,
    "queryField": ["name"]
}