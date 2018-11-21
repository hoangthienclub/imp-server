const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.MAPPROVINCES,
    "moduleName": "Province",
    "fields": [{
            "label": "Google maps ID",
            "attr": "googleMapId",
            "inputType": "single"
        }, {
            "label": "VNese",
            "attr": "name",
            "inputType": "text"
        }, {
            "label": "Keys",
            "attr": "ascii",
            "inputType": "text"
        }, {
            "label": "Country",
            "attr": "countryId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.MAPCOUNTRIES
        }, {
            "label": "Geojson",
            "attr": "geometry",
            "inputType": "json"
        }
    ],
    "childCollections": [collectionConst.MAPDISTRICTS],
    "lookupField": "name",
    "queryField": ["name"]
}