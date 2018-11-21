var typeCast = require("./type.cast");
const config = require("../config");
const systemConst = require("../services/system.const");
const URL = {
    HOME: 1,
    MAP: 2,
    DETAIL: 3,
    FAQ: 4,
    CONTACTUS: 5,
    ABOUTUS: 6,
    NOTIFICATION: 7,
    TERMCONDITION: 8,
    PROFILE: 9,
    EDITPROFILE: 10,
    ASSOCIATION: 11,
    PROVINCECITY: 12,
    INDUSTRIALPARK: 13,
    APP: 14,
    NONE: 0
}
// const siteUrl = config.serviceProtocol + "://" + config.serviceHost + ":" + config.servicePort;
const siteUrl = "http://smartdirectory.vn:3330";
const siteApi = siteUrl + "/" + systemConst.apiVer + "/";
const imageUrl = config.imageServer;

const treeMenu = {
    home: {
        en: { regex: /^(|\/)$/, path: "/" },
        vi: { regex: /^(|\/)$/, path: "/" }
    },
    map: {
        en: { regex: /^\/map(|\/|\/([a-z0-9-]+))$/, path: "/map", param: {url: 2} },
        vi: { regex: /^\/ban\-do(|\/|\/([a-z0-9-]+))$/, path: "/ban-do", param: {url: 2} }
    },
    detail: {
        en: { regex: /^\/detail\/([a-z0-9-]+)$/, path: "/detail", param: {url: 1} },
        vi: { regex: /^\/chi\-tiet\/([a-z0-9-]+)$/, path: "/chi-tiet", param: {url: 1} }
    },
    faq: {
        en: { regex: /^\/faq$/, path: "/faq" },
        vi: { regex: /^\/faq$/, path: "/faq" }
    },
    contactUs: {
        en: { regex: /^\/contact-us$/, path: "/contact-us" },
        vi: { regex: /^\/lien\-he$/, path: "/lien-he" }
    }, 
    termCondition: {
        en: { regex: /^\/term\-and\-condition$/, path: "/term-and-condition" },
        vi: { regex: /^\/dieu\-khoan\-su\-dung$/, path: "/dieu-khoan-su-dung" }
    }, 
    aboutUs: {
        en: { regex: /^\/about\-us$/, path: "/about-us" },
        vi: { regex: /^\/thong\-tin\-ve\-chung\-toi$/, path: "/thong-tin-ve-chung-toi" }
    },
    notification: {
        en: { regex: /^\/notifications$/, path: "/notifications" },
        vi: { regex: /^\/danh\-sach\-thong\-bao$/, path: "/danh-sach-thong-bao" }
    },
    profile: {
        en: { regex: /^\/profile$/, path: "/profile" },
        vi: { regex: /^\/thong\-tin\-ca\-nhan$/, path: "/thong-tin-ca-nhan" }
    },
    editProfile: {
        en: { regex: /^\/profile\/edit$/, path: "/profile/edit" },
        vi: { regex: /^\/thong\-tin\-ca\-nhan\/cap-nhat$/, path: "/thong-tin-ca-nhan/cap-nhat" }
    },
    association: {
        en: { regex: /^\/association\/([a-z0-9-]+)$/, path: "/association", param: {url: 1}  },
        vi: { regex: /^\/thong\-tin\-hiep\-hoi\/([a-z0-9-]+)$/, path: "/thong-tin-hiep-hoi", param: {url: 1}  }
    },
    provinceCity: {
        en: { regex: /^\/province\-city\/([a-z0-9-]+)$/, path: "/province-city", param: {url: 1}  },
        vi: { regex: /^\/thong\-tin\-tinh\-thanh\/([a-z0-9-]+)$/, path: "/thong-tin-tinh-thanh", param: {url: 1}  }
    },
    industrialPark: {
        en: { regex: /^\/industrial\-park\/([a-z0-9-]+)$/, path: "/industrial-park", param: {url: 1}  },
        vi: { regex: /^\/thong\-tin\-khu\-cong\-nghiep\/([a-z0-9-]+)$/, path: "/thong-tin-khu-cong-nghiep", param: {url: 1}  }
    },
    app: {
        en: { regex: /^\/mobile\-app$/, path: "/mobile-app" },
        vi: { regex: /^\/ung\-dung\-mobile$/, path: "/ung-dung-mobile" }
    }
}

var GenerateURL = (lang="en") => {
    var that = this;
    that.lang = lang;
    // 
    that.__getUrl= (page) => {
        return siteUrl + treeMenu[page][that.lang].path;
    }

    that.getHost = () => {
        return siteUrl;
    }
    that.getSiteApi = () => {
        return siteApi;
    }
    that.getReportCompanyApi = () => {
        return siteApi + "action/reportCompany";
    }
    that.getContactCompanyApi = () => {
        return siteApi + "action/contactCompany";
    }
    that.getFeedbackApi = () => {
        return siteApi + "action/feedback";
    }
    that.getSubscribeApi = () => {
        return siteApi + "action/subscribe";
    }
    that.getContactApi = () => {
        return siteApi + "action/contact";
    }
    that.getSignUpApi = () => {
        return siteUrl + "/register";
    }
    that.getLoginApi = () => {
        return siteUrl + "/login";
    }
    that.getLogoutApi = () => {
        return siteUrl + "/login/logout";
    }


    // get page url
    that.getHomeUrl = () => {
        return that.__getUrl("home");
    }
    that.getMapUrl = (slug) => {
        return that.__getUrl("map") + (slug ? "/" + typeCast.castSlug(slug, "-") : "");
    }
    that.getDetailUrl = (slug) => {
        return that.__getUrl("detail") + (slug ? "/" + slug : "");
    }
    that.getFaqUrl = () => {
        return that.__getUrl("faq");
    }
    that.getContactUsUrl = () => {
        return that.__getUrl("contactUs");
    }
    that.getAboutUsUrl = () => {
        return that.__getUrl("aboutUs");
    }
    that.getNotificationUrl = () => {
        return that.__getUrl("notification");
    }
    that.getProfileUrl = () => {
        return that.__getUrl("profile");
    }
    that.getEditProfileUrl = () => {
        return that.__getUrl("editProfile");
    }
    that.getTermConditionUrl = () => {
        return that.__getUrl("termCondition");
    }
    that.getAssociationUrl = (slug) => {
        return that.__getUrl("association") + (slug ? "/" + slug : "");
    }
    that.getProvinceCitylUrl = (slug) => {
        return that.__getUrl("provinceCity") + (slug ? "/" + slug : "");
    }
    that.getIndustrialParkUrl = (slug) => {
        return that.__getUrl("industrialPark") + (slug ? "/" + slug : "");
    }
    that.getAppUrl = () => {
        return that.__getUrl("app");
    }

    // get file url
    that.getComapnyDefaultLogo = () => {
        return siteUrl + "/public/assets/rectangle-3.jpg";
    }
    that.getFileUrl = (url) => {
        return imageUrl + "/" + url;
    }
    that.getAssetUrl = (filePath) => {
        return siteUrl + "/public/" + filePath;
    }
    that.getCss = (filePath) => {
        return `<link rel="stylesheet" href="` + that.getAssetUrl(filePath) + `" type="text/css" />`;
    }
    that.getScript = (filePath) => {
        return `<script src="` + that.getAssetUrl(filePath) + `"></script>`;
    }

    return that;
}


const listUrls = [
    { page: "home", value: URL.HOME },
    { page: "map", value: URL.MAP },
    { page: "detail", value: URL.DETAIL },
    { page: "faq", value: URL.FAQ },
    { page: "contactUs", value: URL.CONTACTUS },
    { page: "aboutUs", value: URL.ABOUTUS },
    { page: "notification", value: URL.NOTIFICATION },
    { page: "termCondition", value: URL.TERMCONDITION },
    { page: "profile", value: URL.PROFILE },
    { page: "editProfile", value: URL.EDITPROFILE },
    { page: "association", value: URL.ASSOCIATION },
    { page: "provinceCity", value: URL.PROVINCECITY },
    { page: "industrialPark", value: URL.INDUSTRIALPARK },
    { page: "app", value: URL.APP },
]

function ValidateURL () {
    __isUrl = (page, reqUrl) => {
        for (let lang in treeMenu[page]) {
            if (reqUrl.match(treeMenu[page][lang].regex)) {
                return true;
            }
        }
        return false;
    }
    

    getTypeUrl = (reqUrl) => {
        for (let url of listUrls) {
            if (__isUrl(url.page, reqUrl)) {
                return url.value
            }
        }
        return URL.NONE;
    }

    return {
        getTypeUrl
    }
}

const getParams = function (url, page, lang="en") {
    for (let lang of config.langs) {
        let matches = url.match(treeMenu[page][lang].regex);
        let obj = {};
        if (matches) {
            for (var e in treeMenu[page][lang].param) {
                obj[e] = matches[treeMenu[page][lang].param[e]];
            }
            return obj;
        }
    }
    return {};
}


module.exports = {GenerateURL, ValidateURL, URL, treeMenu, getParams, siteUrl};