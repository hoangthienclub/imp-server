const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.UNITTYPES,
    "moduleName": "Unit Type",
    "fields": [{
        "label": "Type",
        "attr": "name",
        "inputType": "text"
    }, {
        "label": "Symbol",
        "attr": "symbol",
        "inputType": "text"
    }],
    "lookupField": "name",
    "queryField": ["name"]
}