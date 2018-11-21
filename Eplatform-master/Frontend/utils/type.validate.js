var mongo = require("mongoskin");
var services = {};

/**
 * Kiểm tra tính hợp lệ của email truyền vào.
 * @param {string} email 
 */
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Kiểm tra tính hợp lệ của string ObjectId truyền vào.
 * @param {ObjectId} id 
 */
function validateObjectId(id) {
    if (id && id.toString().length != 24) return false;
    return mongo.helper.isObjectID(id);
}

/**
 * Kiểm tra tính hợp lệ của date truyền vào.
 * @param {Date} date 
 */
function validateDate(date) {
    return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
}

/**
 * Kiểm tra tính hợp lệ của number truyền vào.
 * @param {number} number 
 */
function validateNumeric(number) {
    return !isNaN(parseFloat(number)) && isFinite(number);
}

/**
 * Kiểm tra tính hợp lệ của string truyền vào.
 * Không cho phép truyền vào string chứa ký tự "$".
 * @param {string} text 
 */
function validateText(text) {
    return String(text).match("$") == null ? true : false;
}

services.validateDate = validateDate;
services.validateObjectId = validateObjectId;
services.validateEmail = validateEmail;
services.validateNumeric = validateNumeric;
services.validateText = validateText;

module.exports = services;