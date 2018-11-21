const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.COMPANYCERTIFICATES,
    "moduleName": "Certificate",
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
            "label": "Type of Certificate",
            "attr": "companyQualityCertificateId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.COMPANYQUALITYCERTIFICATES
        }, {
            "label": "Year Begin",
            "attr": "yearBegin",
            "inputType": "date",
            "required": false
        }, {
            "label": "Year End",
            "attr": "yearEnd",
            "inputType": "date",
            "required": false
        }
    ],
    "lookupField": "name",
    "queryField": ["name"]
}