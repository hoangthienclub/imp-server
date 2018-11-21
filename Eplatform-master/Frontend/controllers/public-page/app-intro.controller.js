var systemService = require("../../services/api/system.service");
var MyRender = require("../__render.controller");
var collectionConst = require("../../utils/system.const").COLLECTION;
var Q = require("q");

function Controller (req, res, next) {
    MyRender(req, res, "app-intro", {});
}
module.exports = { GET: Controller };