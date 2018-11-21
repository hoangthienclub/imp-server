const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.COMPANYROLES,
    "moduleName": "Role",
    "fields": [{
        "label": "Role Name",
        "attr": "name",
        "inputType": "text"
    }, {
        "label": "Description",
        "attr": "desc",
        "inputType": "text",
        "required": false
    }],
    "lookupField": "name",
    "queryField": ["name"]
}
