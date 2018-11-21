var mongo = require("mongoskin");
var services = {};

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validateObjectId(id) {
    return mongo.helper.isObjectID(id);
}

function validateDate(date) {
    return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
}

function validateTime(time) {
    return (new Date(time) !== "Invalid Time") && !isNaN(new Date(time));
}

function validateNumeric(number) {
    return !isNaN(parseFloat(number)) && isFinite(number);
}

function validateText(text) {
    return String(text).match("$") == null ? true : false;
}

services.validateDate = validateDate;
services.validateTime = validateTime;
services.validateObjectId = validateObjectId;
services.validateEmail = validateEmail;
services.validateNumeric = validateNumeric;
services.validateText = validateText;

module.exports = services;