const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.CODENAICS,
    "moduleName": "Code NAICS",
    "fields": [{
        "label": "Code NAICS",
        "attr": "code",
        "inputType": "single"
    }, {
        "label": "Name",
        "attr": "name",
        "inputType": "text",
        "required": false        
    },{
        "label": "VN Code",
        "attr": "codeVnId",
        "inputType": "select_lookup",
        "lookupFrom": collectionConst.CODEVNS,
        "required": false
    }, {
        "label": "Parent",
        "attr": "parentId",
        "inputType": "select_lookup",
        "lookupFrom": collectionConst.CODENAICS,
        "required": false
    }],
    "lookupField": [{ "attr": "<strong style='min-width: 50px; display: inline-block;'>", "isField": false }, {"attr": "code"}, { "attr": "</strong>", "isField": false }, { "attr": " ", "isField": false }, "name"],
    "queryField": ["code", "name"]
}