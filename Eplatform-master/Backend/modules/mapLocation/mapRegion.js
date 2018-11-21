const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.MAPREGIONS,
    "moduleName": "Map Region",
    "fields": [{
        "label": "Name",
        "attr": "name",
        "inputType": "text"
    }, {
        "label": "Old Id",
        "attr": "oldId",
        "inputType": "number",
        "required": false
    }, {
        "label": "Desc",
        "attr": "desc",
        "inputType": "text",
        "required": false
    }, {
        "label": "Image",
        "attr": "imageIds",
        "inputType": "file",
        "required": false
    }],
    "lookupField": "name"
}