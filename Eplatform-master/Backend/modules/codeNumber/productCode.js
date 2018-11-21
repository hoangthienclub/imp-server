const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.COMPANYPRODUCTCODES,
    "moduleName": "Product Code",
    "fields": [{
        "label": "Product Code",
        "attr": "code",
        "inputType": "text"
    }, {
        "label": "Name",
        "attr": "name",
        "inputType": "text"
    }, {
        "label": "Parent",
        "attr": "parentId",
        "inputType": "select_lookup",
        "lookupFrom": collectionConst.CODESICS
    }],
    "lookupField": "name",
    "queryField": ["name"]
}