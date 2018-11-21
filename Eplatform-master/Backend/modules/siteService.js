const collectionConst = require("../utils/system.const");
module.exports = {
    "collection": "siteServices",
    "moduleName": "Site Service",
    "fields": [{
        "label": "Our service name",
        "attr": "name",
        "inputType": "text"
        
    }, {
        "label": "Our service title",
        "attr": "title",
        "inputType": "text"
    }, {
        "label": "Our service url",
        "attr": "url",
        "inputType": "url"
    }, {
        "label": "Images",
        "attr": "image",
        "inputType": "file",
        "setFeature": true
    }, {
        "label": "Code",
        "attr": "code",
        "inputType": "text"
    }, {
        "label": "Description",
        "attr": "desc",
        "inputType": "texteditor"
    }, {
        "label": "Set Active",
        "attr": "isActive",
        "inputType": "checkbox"
    }],
    "lookupField": "name",
    "queryField": ["name"]
}