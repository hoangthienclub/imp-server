var express = require('express');
var router = express.Router();
var config = require("../config.json");

// use session auth to secure the angular app files
router.use('/', function (req, res, next) {
    if (req.path !== '/login' && !req.session.token) {
        return res.redirect('/login?returnUrl=' + encodeURI(req.path));
    }
    next();
});

// make JWT token available to angular app
router.get('/token', function(req, res) {
    res.send(req.session.token);
});
router.get('/user-data', function(req, res) {
    res.send(req.session.user);
});
// serve angular app files from the '/app' route
router.use('/', function(req, res) {
    res.render('../angular/index', { fileBrowserUrl: config.fileBrowserUrl });
});

module.exports = router;