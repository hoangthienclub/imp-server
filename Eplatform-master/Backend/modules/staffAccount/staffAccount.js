const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.USERS,
    "moduleName": "User",
    "fields": [{
            "label": "First name",
            "attr": "firstName",
            "inputType": "text"
        }, {
            "label": "Last name",
            "attr": "lastName",
            "inputType": "text"
        }, {
            "label": "Gender",
            "attr": "gender",
            "inputType": "radio",
            "config": "gender"
        }, {
            "label": "Username",
            "attr": "username",
            "inputType": "username"
        }, {
            "label": "Email",
            "attr": "email",
            "inputType": "email"
        }, {
            "label": "Avatar",
            "attr": "avatar",
            "inputType": "file",
            "required": false,
            "setFeature": true
        }, {
            "label": "Password",
            "attr": "password",
            "inputType": "password"
        }, {
            "label": "Roles",
            "attr": "roleIds",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.ROLES,
            "multi": true
        }
    ],
    "lookupField": ["firstName", {"attr": " ", "isField": false}, "lastName"],
    "multiLang": false,
    "queryField": ["firstName", "lastName"]
}