const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.PARTNERNEWS,
    "moduleName": "Partner New",
    "fields": [{
            "label": "Name",
            "attr": "name",
            "inputType": "text"
        }, {
            "label": "Logo",
            "attr": "logoId",
            "inputType": "file"
        }, {
            "label": "Link to Smart Directory",
            "attr": "url",
            "inputType": "single",
            "required": false
        }
    ],
    "lookupField": "name",
    "queryField": ["name"]
}