const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.NAVS,
    "moduleName": "Navigation",
    "fields": [{
            "label": "Navigation name",
            "attr": "name",
            "inputType": "text",
            "slug": true
        }, {
            "label": "Url",
            "attr": "url",
            "inputType": "url"
        }, {
            "label": "Navigation code",
            "attr": "code",
            "inputType": "text"
        }, {
            "label": "Icon",
            "attr": "icon",
            "inputType": "text"
        }, {
            "label": "Images",
            "attr": "image",
            "inputType": "file",
            "multi": false
        }
    ],
    "lookupField": "name",
    "queryField": ["name"]
}