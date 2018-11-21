var typeValidate = require("./type.validate");
var mongo = require("mongoskin");
var services = {};


services.castDate = castDate;
services.castObjectId = castObjectId;
services.castEmail = castEmail;
services.castNumeric = castNumeric;
services.castText = castText;
services.castBool = castBool;
services.castFile = castFile;
services.castMap = castMap;
services.castJson = castJson;
services.castSlug = castSlug;

/**
 * Chuyển đổi một chuỗi string { str } truyền vào sang dạng slug.
 * Các option mở rộng { separate } là ký tự ngăn cách giữa các từ, 
 * { shouldReplaceSpecial } bằng true để loại bỏ hết các ký tự đặc biệt.
 * @param {string} str 
 * @param {char} separate 
 * @param {bool} shouldReplaceSpecial 
 */
function castSlug(str, separate=" ", shouldReplaceSpecial = true) {
    str = str.toLowerCase();
    str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
    str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
    str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
    str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
    str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
    str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
    str = str.replace(/(đ)/g, 'd');
    
    if (shouldReplaceSpecial) {
        str = str.replace(/([^0-9a-z-\s])/g, '');
        str = str.replace(/(\s+)/g, separate);
        str = str.replace(/^\s+/g, '');
        str = str.replace(/\s+$/g, '');
    }
    
    return str;
}

/**
 * Chuyển đổi 1 object nghi vấn sang object thông qua việc stringify obj ra và parse ngược lại.
 * @param {object} jsonStr 
 */
function castJson (jsonStr) {
    let obj = {};
    try {
        obj = JSON.parse(JSON.stringify(jsonStr));
    } catch (ex) {

    }
    return obj;
}

/**
 * Ép kiểu 1 object thành 1 object mới hợp lệ theo cấu trúc lưu của Map.
 * Thông tin bao gồm countryId, provinceId, districtId
 * @param {object} map 
 */
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

/**
 * Ép kiểu 1 object thành 1 object mới hợp lệ theo cấu trúc lưu của File.
 * Thông tin bao gồm url, name và path
 * @param {object} file 
 */
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

/**
 * Ép kiểu { date } sang định dạng hợp lệ.
 * @param {string|Date} date 
 */
function castDate(date) {
    if (typeValidate.validateDate(date)) {
        return new Date(date);
    }
    return new Date();
}

/**
 * Ép kiểu id sang định dạng ObjectId.
 * @param {string|ObjectId} id 
 */
function castObjectId(id) {
    if (typeValidate.validateObjectId(id)) {
        return mongo.helper.toObjectID(id)
    }
    return undefined;
}

/**
 * Ép kiểu email sang định dạng hợp lệ.
 * @param {string} email 
 */
function castEmail(email) {
    if (typeValidate.validateEmail(email)) {
        return email.toLowerCase().replace(new RegExp(" ", "uig"), "");
    }
    return "";
}

/**
 * Ép kiểu { number } sang số hợp lệ.
 * @param {string|number} number 
 */
function castNumeric(number) {
    if (typeValidate.validateNumeric(number)) {
        return parseFloat(number)
    }
    return 0;
}

/**
 * Ép kiểu { text } sang văn bản hợp lệ.
 * @param {string} text 
 */
function castText(text) {
    if (typeValidate.validateText(text)) {
        return String(text);
    }
    return String(text).replace(new RegExp(/\$/, "uig"), "&#36;")
}

/**
 * Ép kiểu { bool } sang Boolean hợp lệ.
 * @param {string|Boolean|number} bool 
 */
function castBool(bool) {
    return Boolean(bool);
}

module.exports = services;