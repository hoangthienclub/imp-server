const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.CONTACTS,
    "moduleName": "Contact",
    "fields": [{
            "label": "Name",
            "attr": "name",
            "inputType": "text"
        }, {
            "label": "Phone Number",
            "attr": "phoneNumber",
            "inputType": "tel"
        }, {
            "label": "Email",
            "attr": "email",
            "inputType": "email"
        }, {
            "label": "Address",
            "attr": "address",
            "inputType": "text",
            "required": false
        }, {
            "label": "Company Name",
            "attr": "companyName",
            "inputType": "text",
            "required": false
        }, {
            "label": "Content",
            "attr": "content",
            "inputType": "textarea"
        }
    ],
    "quickChecks": [
        {
            "label": "Read",
            "attr": "isRead"
        }, {
            "label": "Reply",
            "attr": "isReply"
        }
    ],
    "lookupField": "name",
    "queryField": ["name"]
}