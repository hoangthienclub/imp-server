var MyRender = require("../__render.controller");

function Controller (req, res, next) {
    MyRender(req, res, "notification", {});
}

module.exports = { GET: Controller };