const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.COMPANYEVENTS,
    "moduleName": "Event",
    "fields": [{
        "label": "Company",
        "attr": "companyId",
        "lookupFrom": collectionConst.COMPANIES,
        "inputType": "select_lookup",
        "preload": true,
        "multi": false
    }, {
        "label": "Name",
        "attr": "name",
        "inputType": "text"
    }, {
        "label": "Begining Time",
        "attr": "timeBegin",
        "inputType": "time"
    }, {
        "label": "Begining Date",
        "attr": "dateBegin",
        "inputType": "date"
    }, {
        "label": "Ending Time",
        "attr": "timeEnd",
        "inputType": "time"
    }, {
        "label": "Ending Date",
        "attr": "dateEnd",
        "inputType": "date"
    }, {
        "label": "Address",
        "attr": "address",
        "inputType": "map"
    }, {
        "label": "Organization",
        "attr": "organization",
        "inputType": "text",
        "required": false
    }, {
        "label": "Fee",
        "attr": "fee",
        "inputType": "text"
    }, {
        "label": "Objective User",
        "attr": "objectiveUer",
        "inputType": "text",
        "required": false
    }, {
        "label": "Deadline Register",
        "attr": "deadlineRegister",
        "inputType": "date"
    }, {
        "label": "Description",
        "attr": "description",
        "inputType": "texteditor"
    }, {
        "label": "Note",
        "attr": "note",
        "inputType": "textarea",
        "required": false
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
    "lookupField": "name",
    "queryField": ["name"]
}