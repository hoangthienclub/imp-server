const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.TERMS,
    "moduleName": "Terms",
    "fields": [{
            "label": "Title",
            "attr": "title",
            "inputType": "texteditor"
        }, {
            "label": "Content",
            "attr": "content",
            "inputType": "texteditor"
        }
    ],
    "lookupField": "title",
    "queryField": ["title"]
}