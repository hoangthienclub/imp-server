var systemService = require("../../services/api/system.service");
var MyRender = require("../__render.controller");
var Q = require("q");
const collectionConst = require("../../utils/system.const").COLLECTION;

function Controller (req, res, next) {
    var data = {};

    let promises = [
        systemService.getOne(collectionConst.SETTINGS, {}, req.language)
    ]

    Q.all(promises)
        .then(function (arr) {
            data.websiteData = arr[0];
            MyRender(req, res, "contact-us", data);
        })
        .catch(function (err) {
            console.log(err);
            next();
        })

}
module.exports = { GET: Controller };