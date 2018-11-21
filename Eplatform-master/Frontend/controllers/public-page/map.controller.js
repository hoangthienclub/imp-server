var MyRender = require("../__render.controller");


function Controller (req, res, next) {
    MyRender(req, res, "map", { showFooter: false });
}
module.exports = { GET: Controller };