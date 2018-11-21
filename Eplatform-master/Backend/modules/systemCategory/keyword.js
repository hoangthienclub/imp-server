const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.KEYWORDS,
    "moduleName": "Keyword",
    "fields": [{
        "label": "Name",
        "attr": "name",
        "inputType": "text"
    }, {
        "label": "Keyword url",
        "attr": "url",
        "inputType": "url"
    }, {
        "label": "SEO Images",
        "attr": "imageIds",
        "inputType": "file",
        "multi": false
    }, {
        "label": "Short Description",
        "attr": "shortDesc",
        "inputType": "textarea"
    }, {
        "label": "Count",
        "attr": "count",
        "inputType": "count"
    }],
    "lookupField": "name",
    "queryField": ["name"]
}