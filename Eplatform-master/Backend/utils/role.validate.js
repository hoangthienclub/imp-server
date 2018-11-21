
const ACTION = {
    ADD: "add",
    VIEW: "view",
    DEL: "delete",
    EDIT: "edit",
    AS_ADMIN: "asAdmin"
}
const PERMS = {
    NO_PERM: 0,
    HAS_PERM: 1,
    ADMIN: 2
}

const missPerm = "Missing Permission";

function checkPerm(perms, collection, action) {
    if (perms[collection] && perms[collection][ACTION.AS_ADMIN]) {
        return PERMS.ADMIN;
    }
    if (perms[collection] && perms[collection][action]) {
        return PERMS.HAS_PERM;
    }
    return PERMS.NO_PERM;
}

var services = {};

services.ACTION = ACTION;
services.PERMS = PERMS;
services.missPermMsg = missPerm;
services.checkPerm = checkPerm;

module.exports = services;