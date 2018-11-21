const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.COMPANYPRODUCTS,
    "moduleName": "Product",
    "fields": [{
        "label": "Name",
        "attr": "name",
        "inputType": "text"
    }, {
        "label": "Company",
        "attr": "companyId",
        "lookupFrom": collectionConst.COMPANIES,
        "inputType": "select_lookup",
        "preload": false,
        "multi": false
    }, {
        "label": "Product Code",
        "attr": "productCodeId",
        "inputType": "select_lookup",
        "lookupFrom": collectionConst.COMPANYPRODUCTS,
        "required": false
    }, {
        "label": "Short Description",
        "attr": "shortDesc",
        "inputType": "textarea",
        "required": false
    }, {
        "label": "Description",
        "attr": "desc",
        "inputType": "texteditor",
        "required": false
    }, {
        "label": "Images",
        "attr": "imageIds",
        "inputType": "file",
        "multi": true        
    }],
    "lookupField": "name",
    "queryField": ["name"]
}