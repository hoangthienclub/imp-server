const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.MENUS,
    "moduleName": "Menu",
    "fields": [{
        "label": "Menu Name",
        "attr": "name",
        "inputType": "text"
    }, {
        "label": "Menu",
        "attr": "conf",
        "inputType": "excepts/menu-config",
        "lookupFrom": collectionConst.NAVS
    }, {
        "label": "Set Main",
        "attr": "isMain",
        "inputType": "checkbox"
    }, {
        "label": "Set Top",
        "attr": "isTop",
        "inputType": "checkbox"
    }],
    "multiLang": false,
    "lookupField": "name",
    "queryField": ["name"]
}