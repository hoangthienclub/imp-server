const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.USERACCOUNTS,
    "moduleName": "User Account",
    "fields": [{
            "label": "Level",
            "attr": "level",
            "inputType": "number"
        }, {
            "label": "Name",
            "attr": "name",
            "inputType": "text"
        }, {
            "label": "Gender",
            "attr": "gender",
            "inputType": "radio",
            "config": "gender",
            "required": false
        }, {
            "label": "Age",
            "attr": "age",
            "inputType": "number",
            "required": false
        }, {
            "label": "Email",
            "attr": "email",
            "inputType": "email",
            "required": false
        }, {
            "label": "Phone number",
            "attr": "phoneNumber",
            "inputType": "tel",
            "required": false
        }, {
            "label": "Facebook",
            "attr": "socialMedia.facebook",
            "inputType": "text",
            "multi": false,
            "required": false
        }, {
            "label": "Twitter",
            "attr": "socialMedia.twitter",
            "inputType": "text",
            "multi": false,
            "required": false
        }, {
            "label": "Google+",
            "attr": "socialMedia.google",
            "inputType": "text",
            "multi": false,
            "required": false
        }, {
            "label": "Linkedin",
            "attr": "socialMedia.linkedin",
            "inputType": "text",
            "multi": false,
            "required": false
        }, {
            "label": "Company",
            "attr": "companyId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.COMPANIES,
            "required": false,
            "preload": false
        }, {
            "label": "Position",
            "attr": "positionId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.COMPANYPOSITIONS,
            "required": false                        
        }, {
            "label": "Speaking Languages",
            "attr": "languages",
            "inputType": "text",
            "required": false
        }, {
            "label": "Tax Number",
            "attr": "taxNumber",
            "inputType": "number",
            "required": false
        }, {
            "label": "Card visit",
            "attr": "cardVisitImageId",
            "inputType": "file",
            "required": false
        }, {
            "label": "Indentity Card (CMND)",
            "attr": "cmnd",
            "inputType": "file",
            "required": false
        }, {
            "label": "Agreement",
            "attr": "agreementFileId",
            "inputType": "file",
            "required": false
        }, {
            "label": "Username",
            "attr": "username",
            "inputType": "username",
            "required": false
        }, {
            "label": "Password",
            "attr": "password",
            "inputType": "password",
            "required": false
        }, {
            "label": "Roles",
            "attr": "roleIds",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.ROLES,
            "multi": true,
            "required": false
        }, {
            "label": "Avatar Image",
            "attr": "avatarImageId",
            "inputType": "file",
            "required": false,
            "setFeature": true
        }, {
            "label": "Cover Image",
            "attr": "coverImageId",
            "inputType": "file",
            "required": false
        }
    ],
    "lookupField": ["name"],
    "multiLang": false,
    "queryField": ["name"]
}