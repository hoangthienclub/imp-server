const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.SPECIALZONES,
    "moduleName": "Special Zone",
    "fields": [{
            "label": "Name",
            "attr": "name",
            "inputType": "text"
        }, {
            "label": "Description",
            "attr": "desc",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Address",
            "attr": "address",
            "inputType": "map"
        }
    ],
    "lookupField": "name",
    "queryField": ["name"]
}