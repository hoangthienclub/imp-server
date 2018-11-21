var systemService = require("../../services/api/system.service");
var MyRender = require("../__render.controller");
var Q = require("q");

function Controller (req, res, next) {
    if (req.currentUser) {
        var data = {};

        let promises = [
            
        ]
        Q.all (promises)
            .then(function (arr) {
                MyRender(req, res, "profile", data);
            })
            .catch(function (err) {
                next();
            })
    } else {
        res.redirect('/');
        // no auth screen
    }
}
module.exports = { GET: Controller };