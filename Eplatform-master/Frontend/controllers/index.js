"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PostEditProfile = exports.ViewTermCondition = exports.ViewProfile = exports.ViewNotification = exports.ViewMap = exports.ViewHome = exports.ViewFAQ = exports.ViewEditProfile = exports.ViewDetail = exports.ViewContactUs = exports.ViewAboutUs = undefined;

var _aboutUs = require("./public-page/about-us.controller");

var _contactUs = require("./public-page/contact-us.controller");

var _detail = require("./public-page/detail.controller");

var _editProfile = require("./public-page/edit-profile.controller");

var _faq = require("./public-page/faq.controller");

var _home = require("./public-page/home.controller");

var _map = require("./public-page/map.controller");

var _notification = require("./public-page/notification.controller");

var _profile = require("./public-page/profile.controller");

var _termCondition = require("./public-page/term-condition.controller");

var _modalController = require("./public-page/components/modal.controller");

var _association = require("./public-page/association.controller");

var _provinceCity = require("./public-page/province-city.controller");

var _industrialPark = require("./public-page/industrial-park.controller");

var _app = require("./public-page/app-intro.controller");

exports.ViewAboutUs = _aboutUs.GET;
exports.ViewContactUs = _contactUs.GET;
exports.ViewDetail = _detail.GET;
exports.ViewEditProfile = _editProfile.GET;
exports.ViewFAQ = _faq.GET;
exports.ViewHome = _home.GET;
exports.ViewMap = _map.GET;
exports.ViewNotification = _notification.GET;
exports.ViewProfile = _profile.GET;
exports.ViewTermCondition = _termCondition.GET;
exports.PostEditProfile = _editProfile.POST;
exports.ViewModal = _modalController.ViewModal;
exports.ViewAssociation = _association.GET;
exports.ViewProvinceCity = _provinceCity.GET;
exports.ViewIndustrialPark = _industrialPark.GET;
exports.ViewApp = _app.GET;