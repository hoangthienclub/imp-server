var config = require('../../config.json');
var express = require('express');
var router = express.Router();
var Q = require('q');

var formService = require('../../services/systems/form.service');
var roleService = require("../../services/systems/role.service");
var roleValidate = require("../../utils/role.validate");
var reportService = require("../../services/systems/report.service");
var translateService = require("../../services/translate.service")
// routes

router.get('/translate/:text', translate);
router.post('/:module/report', report);
router.post('/:module/count', count);
router.get('/:module/one', getOne);
router.post('/:module/lookup', lookup);
router.get('/:module/:_id', getById);
router.post('/:module/:_id', update);
router.post('/:module/quickCheck/:_id', updateQuickCheck);
router.post('/:module/featureImage/:_id', updateFeatureImage);
router.post('/:module', save);
router.delete('/:module/:_id', _delete);
router.post('/:module/pages/:page', getPage);
router.post('/:module/call/:fn', call);
router.get('/:module/call/:fn/:_id', call);
module.exports = router;

function translate(req, res) {
    translateService.translateText(req.params.text)
        .then((data) => {
            res.send(data);
        })
        .catch(res.end)
} 

function report(req, res) {
    var collection = req.params.module;
    reportService.chart(collection, {})
        .then(function(rows) {
            if (rows) {
                res.send(rows);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}

function count(req, res) {
    var collection = req.params.module;
    reportService.count(collection, {})
        .then(function(total) {
            res.json({total: total});
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}

function getOne(req, res) {
    var collection = req.params.module;
    var role = roleValidate.checkPerm(req.user.sub.perms, collection, roleValidate.ACTION.VIEW);
    if (role != roleValidate.PERMS.NO_PERM) {
        formService.getOne(collection, role == roleValidate.PERMS.ADMIN)
            .then(function(rows) {
                if (rows) {
                    res.send(rows);
                } else {
                    res.sendStatus(404);
                }
            })
            .catch(function(err) {
                res.status(400).send(err);
            });

    } else {
        res.status(400).send(roleValidate.missPermMsg);
    }
}

function lookup(req, res) {
    var collection = req.params.module;
    var role = roleValidate.checkPerm(req.user.sub.perms, collection, roleValidate.ACTION.VIEW);
    formService.lookup(collection, req.body, role == roleValidate.PERMS.ADMIN)
        .then(function(categories) {
            if (categories) {
                res.send(categories);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}

function getById(req, res) {
    var collection = req.params.module;
    var role = roleValidate.checkPerm(req.user.sub.perms, collection, roleValidate.ACTION.VIEW);
    if (role != roleValidate.PERMS.NO_PERM) {
        if (req.params._id) {
            formService.getById(collection, req.params._id, role == roleValidate.PERMS.ADMIN)
                .then(function(category) {
                    if (category) {
                        res.send(category);
                    } else {
                        res.sendStatus(404);
                    }
                })
                .catch(function(err) {
                    res.status(400).send(err);
                });
        } else {
            res.status(400).send("Not found!");
        }
    } else {
        res.status(400).send(roleValidate.missPermMsg);
    }
}

function getPage(req, res) {
    var collection = req.params.module;
    var role = roleValidate.checkPerm(req.user.sub.perms, collection, roleValidate.ACTION.VIEW);
    
    if (role != roleValidate.PERMS.NO_PERM) {
        try {
            let page = parseInt(req.params.page);
            formService.getPage(collection, page, req.body, role == roleValidate.PERMS.ADMIN)
                .then(function(pageData) {
                    if (pageData) {
                        res.send(pageData);
                    } else {
                        res.sendStatus(404);
                    }
                })
                .catch(function(err) {
                    console.log(err);
                    res.status(400).send(err);
                });
        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    } else {
        res.status(400).send(roleValidate.missPermMsg);
    }
}

function save(req, res) {
    var collection = req.params.module;
    var role = roleValidate.checkPerm(req.user.sub.perms, collection, roleValidate.ACTION.ADD);
    if (role != roleValidate.PERMS.NO_PERM) {
        formService.save(collection, req.body, req.user.sub._id, role == roleValidate.PERMS.ADMIN)
            .then(function(data) {
                res.status(200).send(data);
            })
            .catch(function(err) {
                res.status(400).send(err);
            });

    } else {
        res.status(400).send(roleValidate.missPermMsg);
    }
}

function update(req, res) {
    var collection = req.params.module;
    var role = roleValidate.checkPerm(req.user.sub.perms, collection, roleValidate.ACTION.EDIT);
    if (role != roleValidate.PERMS.NO_PERM) {
        let _id = req.params._id;
        if (_id) {
            formService.update(collection, _id, req.body, req.user.sub._id, role == roleValidate.PERMS.ADMIN)
                .then(function() {
                    res.sendStatus(200);
                })
                .catch(function(err) {
                    res.status(400).send(err);
                });
        } else {
            res.status(400).send("Not found");
        }
    } else {
        res.status(400).send(roleValidate.missPermMsg);
    }
}

function updateQuickCheck(req, res) {
    var collection = req.params.module;
    var role = roleValidate.checkPerm(req.user.sub.perms, collection, roleValidate.ACTION.EDIT);
    if (role != roleValidate.PERMS.NO_PERM) {
        let _id = req.params._id;
        if (_id) {
            formService.updateQuickCheck(collection, _id, req.body, req.user.sub._id, role == roleValidate.PERMS.ADMIN)
                .then(function() {
                    res.sendStatus(200);
                })
                .catch(function(err) {
                    res.status(400).send(err);
                });
        } else {
            res.status(400).send("Not found");
        }
    } else {
        res.status(400).send(roleValidate.missPermMsg);
    }
}

function updateFeatureImage(req, res) {
    var collection = req.params.module;
    var role = roleValidate.checkPerm(req.user.sub.perms, collection, roleValidate.ACTION.EDIT);
    if (role != roleValidate.PERMS.NO_PERM) {
        let _id = req.params._id;
        if (_id) {
            formService.updateFeatureImage(collection, _id, req.body, req.user.sub._id, role == roleValidate.PERMS.ADMIN)
                .then(function() {
                    res.sendStatus(200);
                })
                .catch(function(err) {
                    res.status(400).send(err);
                });
        } else {
            res.status(400).send("Not found");
        }
    } else {
        res.status(400).send(roleValidate.missPermMsg);
    }
}

function _delete(req, res) {
    var collection = req.params.module;
    var role = roleValidate.checkPerm(req.user.sub.perms, collection, roleValidate.ACTION.DEL);
    if (role != roleValidate.PERMS.NO_PERM) {
        var _id = req.params._id;
        formService.delete(collection, _id, req.user.sub._id, role == roleValidate.PERMS.ADMIN)
            .then(function() {
                res.sendStatus(200);
            })
            .catch(function(err) {
                res.status(400).send(err);
            });
    } else {
        res.status(400).send(roleValidate.missPermMsg);
    }
}

function call(req, res) {
    var collection = req.params.module;
    try {
        req.body.userId = req.user.sub._id;
        if (req.params._id) {
            req.body._id = req.params._id;
        }
        formService.call(collection, req.params.fn, req.body, req.user.sub.perms, req.user.sub._id)
            .then(function(resp) {
                if (resp) {
                    res.send(resp);
                } else {
                    res.sendStatus(404);
                }
            })
            .catch(function(err) {
                console.log(err);
                res.status(400).send(err);
            });
    } catch (ex) {
        res.status(400).send("Function was not declared");
    }
}