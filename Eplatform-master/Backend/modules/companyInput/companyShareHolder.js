const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.COMPANYSHAREHOLDERS,
    "moduleName": "Shareholder",
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
            "label": "Phone Number",
            "attr": "phone_number",
            "inputType": "tel",
            "required": false
            
        }, {
            "label": "Email",
            "attr": "email",
            "inputType": "email",
            "required": false

        }, {
            "label": "Address",
            "attr": "address",
            "inputType": "text",
            "required": false
        },  {
            "label": "Share Number",
            "attr": "shareNumber",
            "inputType": "number",
            "required": false
        },  {
            "label": "Rate",
            "attr": "rate",
            "inputType": "decimal",
            "required": false
        }
    ],
    "lookupField": "name",
    "queryField": ["name"]
}