const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.MAPCOUNTRIES,
    "moduleName": "Map Country",
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
        "label": "Flag",
        "attr": "flag",
        "inputType": "file",
        "multi": false
    }],
    "childCollections": [collectionConst.MAPPROVINCES],
    "lookupField": "name",
    "queryField": ["name"]
}