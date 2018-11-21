const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.CODETAGS,
    "moduleName": "Code Tag",
    "fields": [{
        "label": "Name Tag",
        "attr": "name",
        "inputType": "text"
    }],
    "lookupField": "name",
    "queryField": ["name"]
}