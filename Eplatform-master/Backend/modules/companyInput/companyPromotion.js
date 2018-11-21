const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.COMPANYPROMOTIONS,
    "moduleName": "Promotion",
    "fields": [{
        "label": "Company",
        "attr": "companyId",
        "lookupFrom": collectionConst.COMPANIES,
        "inputType": "select_lookup",
        "preload": true,
        "multi": false
    }, {
        "label": "Title",
        "attr": "title",
        "inputType": "text"
    }, {
        "label": "Begining Date",
        "attr": "dateBegin",
        "inputType": "date"
    }, {
        "label": "Ending Date",
        "attr": "dateEnd",
        "inputType": "date"
    }, {
        "label": "Promotion Value",
        "attr": "promotionValue",
        "inputType": "textarea"
    }, {
        "label": "Promotion Description",
        "attr": "description",
        "inputType": "texteditor"
    }, {
        "label": "Condition",
        "attr": "condition",
        "inputType": "texteditor"
    }, {
        "label": "Qualification",
        "attr": "qualification",
        "inputType": "texteditor"
    }, {
        "label": "Images",
        "attr": "imageIds",
        "inputType": "file",
        "multi": true,
        "required": false        
    }, {
        "label": "Status",
        "attr": "status",
        "inputType": "radio",
        "config": "status"
    }],
    "lookupField": "title",
    "queryField": ["title"]
}