const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.MAPPLACES,
    "moduleName": "Map place",
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
        "label": "Location",
        "attr": "location",
        "inputType": "map"
    }, {
        "label": "Group",
        "attr": "mapGroupId",
        "inputType": "select_lookup",
        "lookupFrom": collectionConst.MAPGROUPS
    }],
    "lookupField": "name",
    "queryField": ["name"]
}