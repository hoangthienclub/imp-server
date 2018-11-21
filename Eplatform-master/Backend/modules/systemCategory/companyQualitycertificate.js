const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.COMPANYQUALITYCERTIFICATES,
    "moduleName": "Company Quality Certificate",
    "fields": [{
        "label": "Name",
        "attr": "name",
        "inputType": "text"
    }, {
        "label": "Image",
        "attr": "imageId",
        "inputType": "file",
        "required": false
    }, {
        "label": "Description",
        "attr": "desc",
        "inputType": "text",
        "required": false
    }],
    "lookupField": "name",
    "queryField": ["name"]
}