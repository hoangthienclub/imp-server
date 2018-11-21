var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');

router.post('/logout', function (req, res) {
    req.session.destroy();
    res.clearCookie("token");
    res.end();
});


router.post('/', function (req, res) {
    // authenticate using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/users/authenticate',
        form: req.body,
        json: true
    }, function (error, response, body) {
        console.log(body)
        if (body.token) {
            req.session.token = body.token;
            // if (req.body.remember === "on") {
                res.cookie("token", body.token, {
                    httpOnly: true,
                    path: "/",
                    expires: new Date((new Date()).getTime() + 86400000 * 30)
                })
            // }
            res.json({
                reload: true
            });
        } else {
            res.json({
                reload: false
            });
        }
    });
});

module.exports = router;