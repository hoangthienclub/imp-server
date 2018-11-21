var express = require('express');
var router = express.Router();
var inputConfig = {
    radio: require("../../views/configs/radio"),
}

router.get('/states.js', state);
router.get('/form/:module', form);
router.get('/index/:module', index);
router.get('/index-controller/:module.controller.js', indexController);
router.get('/form-controller/:module.controller.js', formController);
var modules = require("../../modules/config").modules;
const formAction = require("../../modules/config").formAction;

module.exports = router;

function form(req, res) {
    var name = req.params.module;
    if (modules[name]) {
        let moduleCfg = Object.assign({}, modules[name]);

        moduleCfg.lookup = {};
        moduleCfg.inputConfig = inputConfig;
        moduleCfg.displayType = moduleCfg.displayType ? moduleCfg.displayType : "";
        moduleCfg.childCollections = Array.isArray(moduleCfg.childCollections) ? moduleCfg.childCollections : undefined;
        res.render("admin/form", moduleCfg, function(err, html) {
            if (err) {
                if (err.message.indexOf('Failed to lookup view') !== -1) {
                    return res.end('View not found');
                }
                console.log(err);
            }
            res.send(html);
        });
    } else {
        res.end();
    }
}

function index(req, res) {
    let name = req.params.module;
    if (modules[name]) {
        let moduleCfg = Object.assign({}, modules[name]);
        moduleCfg.parentField = moduleCfg.fields.filter((e) => { return e.parentAttr; })[0];
        moduleCfg.formAction = formAction;

        res.render("admin/index", moduleCfg, function(err, html) {
            if (err) {
                if (err.message.indexOf('Failed to lookup view') !== -1) {
                    return res.end('View not found');
                }
                console.log(err);
            }
            res.send(html);
        });
    } else {
        res.end();
    }
}

function indexController(req, res) {
    let name = req.params.module;
    
    if (modules[name]) {
        let moduleCfg = Object.assign({}, modules[name]);
        moduleCfg.parentField = moduleCfg.fields.filter((e) => { return e.parentAttr; })[0];
        moduleCfg.name = name;
        moduleCfg.formAction = formAction;
        res.render("admin/index-controller", moduleCfg, function(err, html) {
            if (err) {
                if (err.message.indexOf('Failed to lookup view') !== -1) {
                    return res.end('View not found');
                }
                console.log(err);
            }
            res.send(html);
        });
    } else {
        res.end();
    }
}

function formController(req, res) {
    let name = req.params.module;
    if (modules[name]) {
        let moduleCfg = Object.assign({}, modules[name]);
        moduleCfg.parentField = moduleCfg.fields.filter((e) => { return e.parentAttr; })[0];
        moduleCfg.name = name;
        moduleCfg.formAction = formAction;
        res.render("admin/form-controller", moduleCfg, function(err, html) {
            if (err) {
                if (err.message.indexOf('Failed to lookup view') !== -1) {
                    return res.end('View not found');
                }
                console.log(err);
            }
            res.send(html);
        });
    } else {
        res.end();
    }
}

function state(req, res) {
    let states = [];
    for (let collection in modules) {
        states.push({singular: collection + formAction, plural: collection})
    }
    console.log(modules.roles)

    res.render("admin/state", {states: states, formAction: formAction}, function(err, html) {
        if (err) {
            if (err.message.indexOf('Failed to lookup view') !== -1) {
                return res.end('View not found');
            }
            console.log(err);
        }
        res.send(html);
    });
}