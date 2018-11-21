const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.SUBSCRIBES,
    "moduleName": "Subscribe",
    "fields": [{
            "label": "Email",
            "attr": "email",
            "inputType": "email"
        }, {
            "label": "Name",
            "attr": "name",
            "inputType": "text"
        }, {
            "label": "Set Verify",
            "attr": "isVerify",
            "inputType": "checkbox"
        }, {
            "label": "Set Unsubscribe",
            "attr": "isUnsubscribe",
            "inputType": "checkbox"
        }
    ],
    "lookupField": "name",
    "queryField": ["name"]
}