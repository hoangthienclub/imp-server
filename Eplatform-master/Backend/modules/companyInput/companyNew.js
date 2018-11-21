const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.COMPANYNEWS,
    "moduleName": "News",
    "fields": [{
            "label": "Company",
            "attr": "companyId",
            "lookupFrom": collectionConst.COMPANIES,
            "inputType": "select_lookup",
            "preload": false,
            "multi": false,
            "required": false,
        }, {
            "label": "Industrial Park",
            "attr": "industrialParkId",
            "lookupFrom": collectionConst.INDUSTRIALPARKS,
            "inputType": "select_lookup",
            "preload": false,
            "multi": false,
            "required": false,
        }, {
            "label": "Province/City",
            "attr": "provinceCityId",
            "lookupFrom": collectionConst.PROVINCECITIES,
            "inputType": "select_lookup",
            "preload": false,
            "multi": false,
            "required": false,
        }, {
            "label": "Association",
            "attr": "associationId",
            "lookupFrom": collectionConst.ASSOCIATIONS,
            "inputType": "select_lookup",
            "preload": false,
            "multi": false,
            "required": false,
        }, {
            "label": "Title",
            "attr": "title",
            "inputType": "text"
        }, {
            "label": "Short Description",
            "attr": "desc",
            "inputType": "textarea",
            "required": false
        }, {
            "label": "Content",
            "attr": "content",
            "inputType": "texteditor"
        }, {
            "label": "Images",
            "attr": "imageIds",
            "inputType": "file",
            "setFeature": true
        }, {
            "label": "Date Publish",
            "attr": "date",
            "inputType": "date"
        }
    ],
    "lookupField": "title",
    "queryField": ["title"]
}