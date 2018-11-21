var Q = require('q');
var _ = require('lodash');
var express = require('express');
var router = express.Router();
var systemService = require('../../services/api/system.service');
var searchService = require('../../services/search.service');
var langService = require("../../services/lang.service");
var GenerateUrl = require("../../utils/url.util").GenerateURL;
const collectionConst = require("../../utils/system.const").COLLECTION;


router.get("/company/:_id", ViewEditCompany);
module.exports = router;
/**
 * Lấy về trang edit công ty
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next Dùng next() để chuyển sang route tiếp theo
 */
function ViewEditCompany(req, res, next)
{
    console.log(req.session);
    res.send("Edit page, nội dung trang sẽ được cập nhật sau.");
}