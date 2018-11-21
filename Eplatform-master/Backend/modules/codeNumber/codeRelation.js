const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.CODERELATIONS,
    "moduleName": "Code Relation",
    "fields": [{
            "label": "Code VN",
            "attr": "codeVnId",
            "inputType": "select_lookup",
            "preload": false,
            "lookupFrom": collectionConst.CODEVNS
        }, {
            "label": "Code NAICS",
            "attr": "codeNaicsIds",
            "inputType": "select_lookup",
            "preload": false,
            "lookupFrom": collectionConst.CODENAICS,
            "multi": true
        }, {
            "label": "Code SIC",
            "attr": "codeSicIds",
            "inputType": "select_lookup",
            "preload": false,
            "lookupFrom": collectionConst.CODESICS,
            "multi": true
        }
    ],
    "multiLang": false,
    "queryFieldFromAnother": {
        "from": collectionConst.CODEVNS,
        "attr": "codeVnId",
        "preload": false
    }
}
