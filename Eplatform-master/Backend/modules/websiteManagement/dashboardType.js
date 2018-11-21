const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.DASHBOARDTYPES,
    "moduleName": "Dashboard Type",
    "fields": [{
        "label": "Name",
        "attr": "name",
        "inputType": "text"
    }, {
        "label": "Order",
        "attr": "order",
        "inputType": "number"
    }],
    "lookupField": "name",
    "queryField": ["name"]
}