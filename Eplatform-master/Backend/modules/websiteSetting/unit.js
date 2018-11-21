const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.UNITS,
    "moduleName": "Unit",
    "fields": [{
        "label": "Unit name",
        "attr": "name",
        "inputType": "text"
    }, {
        "label": "Symbol",
        "attr": "symbol",
        "inputType": "text"
    }, {
        "label": "Type",
        "attr": "type",
        "inputType": "select_lookup",
        "lookupFrom": collectionConst.UNITTYPES
    }, {
        "label": "Rate",
        "attr": "rate",
        "inputType": "decimal"
    }],
    "lookupField": "name",
    "queryField": ["name"]
}