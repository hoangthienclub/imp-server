var Q = require("q");
var express = require('express');
var router = express.Router();
var request = require('request');
var userService = require("../../services/user.service");
var langService = require("../../services/lang.service");
var config = require('config.json');
var crypto = require('utils/rsa_crypto');

// routes
router.post('/authenticate', authenticateUser);
router.post('/register', registerUser);
router.get('/current', getCurrentUser);
router.put('/:_id', updateUser);
router.delete('/:_id', deleteUser);
router.post('/deToken', deToken);

module.exports = router;

function deToken(req, res) {
    var token = req.body.token;
    var privateKey = config.privateKey;

    if (crypto.decrypt(token, privateKey) == "") {
        res.send({
            token: crypto.decrypt(token, privateKey),
            statusCode: 400
        });
    } else {
        res.send({
            token: crypto.decrypt(token, privateKey),
            statusCode: 200
        });
    }
    // request.post({
    //     url: config.ssoUrl + '/api/users/decryptToken',
    //     form: req.body,
    //     json: true
    // }, function (error, response, body) {
    //     // save JWT token in the session to make it available to the angular app
    //     res.send({
    //         statusCode: body.statusCode,
    //         token: body.token
    //     })
    // });
}

function authenticateUser(req, res) {
    userService.authenticate(req.body.username, req.body.password)
        .then(function (token) {
            promises = [langService.getViewLang(["modals/login/success"], req.language)]
            Q.all(promises)
                .then(function (arr) {
                    res.render (req.platform + "modals/success", {langData: arr[0]}, function (err, html) {
                        if (err) {
                            console.log(err);
                            return res.status(510).send(err);
                        } else {
                            res.json({
                                token: token,
                                html: html
                            })
                        }
                    })
                })
                .catch(function (err) {
                    console.log(err);
                    res.status(510).send(err);
                })
        })
        .catch(function (err) {
            console.log(err);
            promises = [langService.getViewLang(["modals/login/fail"], req.language)]
            Q.all(promises)
                .then(function (arr) {
                    res.render (req.platform + "modals/fail", {langData: arr[0], key: err}, function (err, html) {
                        if (err) {
                            console.log(err);
                            return res.status(510).send(err);
                        }
                        else {
                            res.json({
                                html: html
                            })
                        }
                    })
                })
                .catch(function (err) {
                    res.status(510).send(err);
                })
        });
}

function registerUser(req, res) {
    userService.create(req.body)
        .then(function () {
            promises = [langService.getViewLang(["modals/signup/success"], req.language)]
            Q.all(promises)
                .then(function (arr) {
                    res.render(req.platform + "modals/success", {langData: arr[0]})
                })
                .catch(function (err) {
                    res.status(510).send(err);
                })
        })
        .catch(function (err) {
            promises = [langService.getViewLang(["modals/signup/fail"], req.language)];
            Q.all(promises)
                .then(function (arr) {
                    res.render(req.platform + "modals/fail", {langData: arr[0], key: err})
                })
                .catch(function (err) {
                    res.status(510).send(err);
                })
        });
}

function getCurrentUser(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateUser(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only update own account
        return res.status(401).send('You can only update your own account');
    }

    userService.update(userId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteUser(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only delete own account
        return res.status(401).send('You can only delete your own account');
    }

    userService.delete(userId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}