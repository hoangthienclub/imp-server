var express = require('express');
var router = express.Router();
var userService = require("../services/user.service");
var urlUtil = require("../utils/url.util");
var config = require("../config");
var jwt = require('jsonwebtoken');
var typeValidate = require("../utils/type.validate");
const collectionConst = require("../utils/system.const").COLLECTION;
var request = require('request');
var Q = require("q");

// require controler
const Controller = require("./index");


router.get("/modal/:modal", Controller.ViewModal);


var validateUlr = urlUtil.ValidateURL();
// if authorization, encode token
router.use(function (req, res, next) {
    delete req.currentUser;
    if (!req.session.token) {
        if (req.cookies && req.cookies.token) {
            req.session.token = req.cookies.token;
        }
    }
    if (req.session.token) {
        let decodeData = jwt.decode(req.session.token, config.secret);

        if (typeValidate.validateObjectId(decodeData.sub)) {
            var promises = [];
            promises.push(userService.getById(decodeData.sub, req.session.token));
            promises.push(userService.getInfoLevelById(decodeData.sub));
            Q.all(promises)
                .then(function (arr) {
                    if (arr[0].statusCode == 200) {
                        arr[0].user.currentLevel = arr[1].current;
                        arr[0].user.statusLevel = arr[1].status;
                        req.currentUser = arr[0].user;
                    }
                    next();
                })
                .catch(function (err) {
                    next();
                })
        } else {
            console.log(decodeData.sub);
            next();
        }
    } else {
        next();
    }
})

const listPages = [
    { state: urlUtil.URL.HOME, controller: Controller.ViewHome },
    { state: urlUtil.URL.MAP, controller: Controller.ViewMap },
    { state: urlUtil.URL.DETAIL, controller: Controller.ViewDetail },
    { state: urlUtil.URL.FAQ, controller: Controller.ViewFAQ },
    { state: urlUtil.URL.CONTACTUS, controller: Controller.ViewContactUs },
    { state: urlUtil.URL.ABOUTUS, controller: Controller.ViewAboutUs },
    { state: urlUtil.URL.NOTIFICATION, controller: Controller.ViewNotification },
    { state: urlUtil.URL.TERMCONDITION, controller: Controller.ViewTermCondition },
    { state: urlUtil.URL.PROFILE, controller: Controller.ViewProfile },
    { state: urlUtil.URL.EDITPROFILE, controller: Controller.ViewEditProfile },
    { state: urlUtil.URL.ASSOCIATION, controller: Controller.ViewAssociation },
    { state: urlUtil.URL.INDUSTRIALPARK, controller: Controller.ViewIndustrialPark },
    { state: urlUtil.URL.PROVINCECITY, controller: Controller.ViewProvinceCity },
    { state: urlUtil.URL.APP, controller: Controller.ViewApp },
]

const listPost = [
    { state: urlUtil.URL.EDITPROFILE, update: Controller.PostEditProfile },
]


router.get(/^(.+)$/, (req, res, next) => {
    let valUrl = validateUlr.getTypeUrl(req.path);
    for (let page of listPages) {
        if (valUrl === page.state) {
            return page.controller(req, res, next);
        }
    }
    next();
})

router.post(/^(.+)$/, (req, res, next) => {
    let valUrl = validateUlr.getTypeUrl(req.path);
    for (let page of listPost) {
        if (valUrl === page.state) {
            return page.update(req, res, next);
        }
    }
    next();
})
module.exports = router;