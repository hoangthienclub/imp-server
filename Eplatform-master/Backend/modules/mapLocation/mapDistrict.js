const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.MAPDISTRICTS,
    "moduleName": "District",
    "fields": [{
            "label": "Google maps ID",
            "attr": "googleMapId",
            "inputType": "single"
        }, {
            "label": "Province",
            "attr": "provinceId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.MAPPROVINCES
        }, {
            "label": "VNese",
            "attr": "name",
            "inputType": "text"
        }, {
            "label": "Keys",
            "attr": "ascii",
            "inputType": "text"
        }, {
            "label": "Geojson",
            "attr": "geometry",
            "inputType": "json"
        }
    ],
    "lookupField": "name",
    "queryField": ["name"]
}