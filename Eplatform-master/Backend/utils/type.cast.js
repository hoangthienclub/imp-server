var typeValidate = require("./type.validate");
var mongo = require("mongoskin");
var roleValidate = require("./role.validate");
var services = {};


services.castDate = castDate;
services.castObjectId = castObjectId;
services.castEmail = castEmail;
services.castNumeric = castNumeric;
services.castText = castText;
services.castBool = castBool;
services.castFile = castFile;
services.castMap = castMap;
services.castRole = castRole;
services.castJson = castJson;
services.castSlug = castSlug;
services.castTime = castTime;


function castSlug(str) {
    str = str.toLowerCase();
    str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
    str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
    str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
    str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
    str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
    str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
    str = str.replace(/(đ)/g, 'd');

    
    str = str.replace(/([^0-9a-z-\s])/g, '');
    str = str.replace(/(\s+)/g, ' ');
    str = str.replace(/^\s+/g, '');
    
    str = str.replace(/\s+$/g, '');
    return str;
}

function castJson (jsonStr) {
    let obj = {};
    try {
        obj = JSON.parse(JSON.stringify(jsonStr));
    } catch (ex) {

    }
    return obj;
}

function castRole (role) {
    if (typeof role == typeof {}) {
        for (var roleAction in roleValidate.ACTION) {
            role[roleValidate.ACTION[roleAction]] = castBool(role[roleValidate.ACTION[roleAction]]);
        }
        return role;
    } else {
        return {};
    }
}

function castMap(map) {
    if (typeof map == typeof {}) {
        if (typeof map.latLng == typeof {}) {
            map.latLng.lat = castNumeric(map.latLng.lat);
            map.latLng.lng = castNumeric(map.latLng.lng);
        } else {
            map.latLng = {
                lat: 10.940542,
                lng: 106.728244
            }
        }
        map.countryId = castObjectId(map.countryId);
        map.provinceId = castObjectId(map.provinceId);
        map.districtId = castObjectId(map.districtId);
        
        return map;
    } else {
        return {};
    }
}

function castFile(file) {
    if (file && typeof file == typeof {}) {
        return {
            url: castText(file.url),
            name: castText(file.name),
            path: castText(file.path)
        }
    }
    return undefined;
}

function castDate(date) {
    if (typeValidate.validateDate(date)) {
        return new Date(date);
    }
    return new Date();
}

function castTime(time) {
    if (typeValidate.validateTime(time)) {
        return new Date(time);
    }
    return new Date();
}

function castObjectId(id) {
    if (typeValidate.validateObjectId(id)) {
        return mongo.helper.toObjectID(id)
    }
    return undefined;
}

function castEmail(email) {
    if (typeValidate.validateEmail(email)) {
        return email.toLowerCase().replace(new RegExp(" ", "uig"), "");
    }
    return "";
}

function castNumeric(number) {
    if (typeValidate.validateNumeric(number)) {
        return parseFloat(number)
    }
    return 0;
}

function castText(text) {
    if (typeValidate.validateText(text)) {
        return String(text);
    }
    return String(text).replace(new RegExp(/\$/, "uig"), "&#36;")
}

function castBool(bool) {
    return Boolean(bool);
}

module.exports = services;