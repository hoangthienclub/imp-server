const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.PARTNERS,
    "moduleName": "Partner",
    "fields": [{
            "label": "Partners",
            "attr": "companyPartnerIds",
            "inputType": "select_lookup",
            "preload": false,
            "lookupFrom": collectionConst.COMPANIES,
            "multi": true
        }, {
            "label": "Customers",
            "attr": "companyCustomerIds",
            "inputType": "select_lookup",
            "preload": false,
            "lookupFrom": collectionConst.COMPANIES,
            "multi": true
        }
    ],
    "multiLang": false
}
