var systemService = require("../../services/api/system.service");
var MyRender = require("../__render.controller");
var Q = require("q");
const collectionConst = require("../../utils/system.const").COLLECTION;

function Controller (req, res, next) {
    var data = {};

    let promises = [
        systemService.getList(collectionConst.ABOUTUSES, {}, req.language)
    ]
    Q.all (promises)
        .then(function (arr) {
            data.aboutUsData = arr[0].rows;
            MyRender(req, res, "about-us", data);
        })
        .catch(function (err) {
            next();
        })
}
module.exports = { GET: Controller };