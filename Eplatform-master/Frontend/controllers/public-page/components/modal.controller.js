var Q = require("q");
var GenerateURL = require("../../../utils/url.util").GenerateURL;
var langService = require("../../../services/lang.service");

function ViewModal (req, res) {
    let genUrl = GenerateURL(req.language);
    let promises = [
        langService.getViewLang(["modals/" + req.params.modal], req.language)
    ]
    Q.all(promises).then(function (arr) {
        res.render(req.platform + "modals/" + req.params.modal, {genUrl: genUrl, langData: arr[0], receiveData: req.query}, function (err, html) {
            if (err) {
                res.status(510).send(err);
            } else {
                res.send(html);
            }
        });
    }).catch(function (err) {
        res.status(510).send(err);
    })
}

module.exports = { ViewModal: ViewModal };