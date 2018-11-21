var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');
var Q = require("q");
var userService = require("../services/user.service");
var jwt = require('jsonwebtoken');
var typeValidate = require("utils/type.validate");

router.post('/', function (req, res) {
    if (req.headers.token) {
        token = req.headers.token;
    } else {
        token = req.session.token;
    }
    let decodeData = jwt.decode(token, config.secret);
    if (typeValidate.validateObjectId(decodeData.sub)) {
        userService.update(decodeData.sub, token, req.body)
            .then(function(data) {
                data = JSON.parse(data);
               if (data.statusCode == 200) {
                    request.post({
                        headers: {
                            'Authorization': "Bearer " + token
                        },
                        url: config.apiUrl + '/users/upgradelevel?uid=' + decodeData.sub,
                        form: {
                            token: token
                        },
                        json: true
                    }, function (error, response, body) {
                        res.send(body);
                    });
               }
            })
            .catch(function(err) {
                res.send({
                    statusCode: 403,
                    error: err
                });
            });
    } else {
        res.send({
            statusCode: 403,
            message: "Not login"
        });
    }
});

module.exports = router;