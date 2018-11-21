const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.COMPANYJOBS,
    "moduleName": "Job",
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
        "label": "Salary",
        "attr": "salary",
        "inputType": "text"
    }, {
        "label": "Type",
        "attr": "type",
        "inputType": "text"
    }, {
        "label": "Address",
        "attr": "address",
        "inputType": "map"
    }, {
        "label": "Job Description",
        "attr": "jobDescription",
        "inputType": "texteditor"
    }, {
        "label": "Main Responsibilities",
        "attr": "responsibilities",
        "inputType": "texteditor"
    }, {
        "label": "Qualification",
        "attr": "qualification",
        "inputType": "texteditor"
    }, {
        "label": "Benefit",
        "attr": "benefit",
        "inputType": "texteditor"
    }, {
        "label": "Deadline",
        "attr": "deadline",
        "inputType": "date"
    },{
        "label": "Note",
        "attr": "note",
        "inputType": "textarea",
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