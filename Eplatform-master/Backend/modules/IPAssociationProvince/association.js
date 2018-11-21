const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.ASSOCIATIONS,
    "moduleName": "Association",
    "fields": [
        {
            "label": "Name",
            "attr": "name",
            "slug": true,
            "inputType": "text"
        }, {
            "label": "Association url",
            "attr": "url",
            "inputType": "url"
        },{
            "label": "Phone Number",
            "attr": "phoneNumber",
            "inputType": "tel",
            "required": false
        }, {
            "label": "Email",
            "attr": "email",
            "inputType": "email",
            "required": false
        }, {
            "label": "Website",
            "attr": "website",
            "inputType": "text",
            "multi": false,
            "required": false
        }, {
            "label": "Fax",
            "attr": "fax",
            "inputType": "number",
            "required": false
        }, {
            "label": "Address",
            "attr": "address",
            "inputType": "map"
        }, {
            "label": "Description",
            "attr": "desc",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "FoundDate",
            "attr": "foundDate",
            "inputType": "date",
            "required": false
        }, {
            "label": "Registration Number",
            "attr": "registrationNumber",
            "inputType": "text",
            "required": false
        }, {
            "label": "President",
            "attr": "president",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Vice President",
            "attr": "vicePresident",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Representative",
            "attr": "representative",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Secretary",
            "attr": "secretary",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Note",
            "attr": "note",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Logo",
            "attr": "logoImageId",
            "inputType": "file",
            "required": false
        }, {
            "label": "Gallery Image",
            "attr": "imageIds",
            "inputType": "file",
            "required": false,
            "multi": true
        }
    ],
    "lookupField": "name",
    "queryField": ["name"]
}