const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.COMPANYCONTACTS,
    "moduleName": "Contact",
    "fields": [{
            "label": "Company",
            "attr": "companyId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.COMPANIES
        }, {
            "label": "Name",
            "attr": "name",
            "inputType": "text"
        }, {
            "label": "Gender",
            "attr": "gender",
            "inputType": "radio",
            "config": "gender"
        }, {
            "label": "Address",
            "attr": "address",
            "inputType": "text",
            "required": false
        }, {
            "label": "Phone number",
            "attr": "phoneNumber",
            "inputType": "tel",
            "required": false            
        }, {
            "label": "Email",
            "attr": "email",
            "inputType": "email",
            "required": false                        
        }, {
            "label": "Position",
            "attr": "positionId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.COMPANYPOSITIONS,
            "required": false                        
        }, {
            "label": "Degree",
            "attr": "degreeId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.COMPANYDEGREES,
            "required": false                        
        }
    ],
    "lookupField": "name",
    "queryField": ["name"]
}