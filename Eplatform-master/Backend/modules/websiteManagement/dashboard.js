const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.DASHBOARDS,
    "moduleName": "Dashboard",
    "fields": [{
        "label": "Name",
        "attr": "name",
        "inputType": "text"
    }, {
        "label": "Icon image",
        "attr": "imageId",
        "inputType": "file",
        "multi": false
    }, {
        "label": "Value",
        "attr": "value",
        "inputType": "number"
    }, {
        "label": "Index",
        "attr": "Index",
        "inputType": "number"
    }, {
        "label": "Position",
        "attr": "Position",
        "inputType": "number"
    }, {
        "label": "Count data",
        "attr": "countData",
        "inputType": "radio",
        "config": "countData"
    }],
    "lookupField": "name",
    "queryField": ["name"]
}