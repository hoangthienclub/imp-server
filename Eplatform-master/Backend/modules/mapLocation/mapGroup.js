const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.MAPGROUPS,
    "moduleName": "Map group",
    "fields": [{
        "label": "Name",
        "attr": "name",
        "inputType": "text"
    }, {
        "label": "Desc",
        "attr": "desc",
        "inputType": "text",
        "required": false
    }, {
        "label": "Avatar",
        "attr": "avatar",
        "inputType": "file",
        "multi": false
    }],
    "lookupField": "name",
    "queryField": ["name"]
}