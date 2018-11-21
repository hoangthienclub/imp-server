var systemService = require("../../services/api/system.service");
var MyRender = require("../__render.controller");
var collectionConst = require("../../utils/system.const").COLLECTION;
var Q = require("q");

function Controller (req, res, next) {
    var data = {};

    let promises = [
        systemService.getOne(collectionConst.TERMS, {}, req.language)
    ]

    Q.all(promises)
        .then(function (arr) {
            data.termData = arr[0];
            MyRender(req, res, "term-condition", data);
        })
        .catch(function (err) {
            console.log(err);
            next();
        })

}
module.exports = { GET: Controller };