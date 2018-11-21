const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.ABOUTUSES,
    "moduleName": "About Us",
    "fields": [{
            "label": "Title",
            "attr": "title",
            "inputType": "text"
        }, {
            "label": "Short Description",
            "attr": "shortDesc",
            "inputType": "textarea"
        }, {
            "label": "Title Description",
            "attr": "titleDesc",
            "inputType": "text"
        }, {
            "label": "Full Description",
            "attr": "fullDesc",
            "inputType": "textarea",
            "rows": 10
        }, {
            "label": "Icon Image",
            "attr": "imageId",
            "inputType": "file"
        }
    ],
    "lookupField": "title",
    "queryField": ["title"]
}