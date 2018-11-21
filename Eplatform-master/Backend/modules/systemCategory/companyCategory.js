const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.COMPANYCATEGORIES,
    "moduleName": "Company Category",
    "fields": [
        {
            "label": "Name",
            "attr": "name",
            "inputType": "text"
        }, {
            "label": "Group Categories",
            "attr": "groupId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.COMPANYGROUPCATEGORIES,    
            "required": false
        }, {
            "label": "Icon Homepage (60x60 .png)",
            "attr": "imageIconId",
            "inputType": "file"
        }, {
            "label": "Marker Map (24x34 .png)",
            "attr": "imageMarkerId",
            "inputType": "file"
        }
    ],
    "lookupField": "name",
    "queryField": ["name"]
}