const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.COMPANYPOSITIONS,
    "moduleName": "Company Position",
    "fields": [{
        "label": "Name",
        "attr": "name",
        "inputType": "text"
        
    }, {
        "label": "Description",
        "attr": "desc",
        "inputType": "text",
        "required": false
    }],
    "lookupField": "name",
    "queryField": ["name"]
}