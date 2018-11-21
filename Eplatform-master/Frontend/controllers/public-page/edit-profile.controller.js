var userService = require("../../services/user.service");
var companyService = require("services/company.service");
var MyRender = require("../__render.controller");
var Q = require("q");
var jwt = require('jsonwebtoken');
var typeValidate = require("utils/type.validate");
var config = require("config");

function Controller (req, res, next) {
    if (req.currentUser) {
        var data = {
            jwt: req.cookies.token
        };

        let promises = [
            companyService.getListCompanyName("")
        ]
        Q.all (promises)
            .then(function (arr) {
                data.company = arr[0].data;
                MyRender(req, res, "edit-profile", data);
            })
            .catch(function (err) {
                console.log(err);
                next();
            })
    } else {
        res.redirect('/');
    }
}
function Update (req, res, next) {
    let decodeData = jwt.decode(req.session.token, config.secret);
    if (typeValidate.validateObjectId(decodeData.sub)) {
        userService.update(decodeData.sub, req.session.token, req.body)
            .then(function(data) {
                res.send({
                    data: data,
                    statusCode: 200
                });
            })
            .catch(function(err) {

            });
    }
    // if (req.currentUser) {
    //     let data = req.body;
    //     let imageType = req.params.imageType;
    //     data.uuid = req.uuid;

    //     systemService.updateImageProfile(req.currentUser._id, imageType, data)
    //         .then(function () {
    //             res.json({status: "OK"})
    //         })
    //         .catch(function () {
    //             res.json({status: "ERROR"});
    //         })
    // } else {
    //     res.json({status: "ERROR"});
    // }
}

module.exports = { GET: Controller, POST: Update };