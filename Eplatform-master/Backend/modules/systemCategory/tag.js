const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.TAGS,
    "moduleName": "Tag",
    "fields": [{
        "label": "Group",
        "attr": "collection",
        "inputType": "readonly"
    }, {
        "label": "Name",
        "attr": "name",
        "inputType": "text"
    }, {
        "label": "Tag url",
        "attr": "url",
        "inputType": "url"
    }, {
        "label": "SEO Images",
        "attr": "image",
        "inputType": "file"
    }, {
        "label": "Short Description",
        "attr": "shortDesc",
        "inputType": "textarea"
    }],
    "lookupField": "name",
    "queryField": ["name"]
}