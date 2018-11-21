const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.FAQS,
    "moduleName": "faq",
    "fields": [{
            "label": "Question",
            "attr": "question",
            "inputType": "textarea"
        }, {
            "label": "Answer",
            "attr": "answer",
            "inputType": "textarea"
        }
    ],
    "lookupField": "question",
    "queryField": ["question"]
}