var systemConst = require("../services/system.const");
var urlUtil = require("../utils/url.util");
var siteService = require("../services/site.service");
var systemService = require("../services/api/system.service");
var langService = require("../services/lang.service");
var moment = require('moment');
const collectionConst = require("../utils/system.const").COLLECTION;

var Q = require("q");

function MyRender(req, res, view, pageData) {
    var lang = req.language;
    if (pageData.showFooter != false) pageData.showFooter = true;
    let promises = [
        siteService.getCookie(req.uuid),
        systemService.getOne(collectionConst.SETTINGS, {}, lang),
        langService.getViewLang([view, "header", "footer", "popup"], lang),
        siteService.getCookieDownloadApp(req.uuid),
    ]

    if (!req.currentUser) {
        req.currentUser = {};
    }
    
    Q.all (promises)
        .then(function (arr) {
            res.render(req.platform + view, {
                moment: moment,
                siteInfo: arr[1],
                cookieAccepted: arr[0] > 0 ? true : false,
                genUrl: urlUtil.GenerateURL(lang),
                langData: arr[2],
                pageData: pageData,
                currentUser: req.currentUser,
                language: lang,
                cookieDownloadClosed: arr[3] > 0 ? true : false,
            }, function (err, html) {
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    if (req.platform == "json/") {
                        res.setHeader('Content-Type', 'application/json');
                    }
                    res.send(html);
                }
            });
        })
        .catch (function (err) {
            console.log(err);
            next();
        })
}

module.exports = MyRender;