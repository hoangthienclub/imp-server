var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');
var systemConst = require("../services/system.const");


router.post('/', function (req, res) {
    // register using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/users/register',
        form: req.body,
        json: true
    }, function (error, response) {
        if (error) {
            return res.render('register', { error: 'An error occurred' });
        }
        res.send(response.body);
    });
});

module.exports = router;