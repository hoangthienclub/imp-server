const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.SETTINGS,
    "moduleName": "Setting",
    "fields": [{
            "label": "Site name",
            "attr": "name",
            "inputType": "text"
        }, {
            "label": "Email",
            "attr": "email",
            "inputType": "email"
        }, {
            "label": "Phone",
            "attr": "phone",
            "inputType": "tel"
        }, {
            "label": "Address",
            "attr": "address",
            "inputType": "map"
        }, {
            "label": "Header logo",
            "attr": "headerLogo",
            "inputType": "file"
        }, {
            "label": "Footer logo",
            "attr": "footerLogo",
            "inputType": "file"
        }, {
            "label": "Meta",
            "attr": "meta",
            "inputType": "html"
        }
    ],
    "lookupField": "name",
    "queryField": ["name"]
}