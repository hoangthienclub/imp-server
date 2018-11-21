const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.CUSTOMERREVIEWS,
    "moduleName": "Customer Review",
    "fields": [{
            "label": "Name",
            "attr": "name",
            "inputType": "text"
        }, {
            "label": "Number of Stars [1-5]",
            "attr": "star",
            "inputType": "number"
        }, {
            "label": "Review",
            "attr": "review",
            "inputType": "textarea"
        }, {
            "label": "Image",
            "attr": "imageId",
            "inputType": "file"
        }
    ],
    "lookupField": "name",
    "queryField": ["name"]
}