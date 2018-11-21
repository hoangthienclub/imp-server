const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.SITEDOCUMENTS,
    "moduleName": "Site Document",
    "fields": [{
            "label": "Document name",
            "attr": "name",
            "inputType": "text"
        }, {
            "label": "Detail",
            "attr": "detail",
            "inputType": "texteditor"
        }
    ],
    "routes": {
        "more": [{
            "route": "index.siteDocumentLayout({_id: row._id})", "label": "View", "icon": "fa-html5", "aIcon": "btn-info"
        }]
    },
    "lookupField": "name",
    "queryField": ["name"]
}