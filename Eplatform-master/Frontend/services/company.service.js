var config = require('config.json');
var Q = require('q');
var request = require('request');

var service = {};
service.getListCompanyName = getListCompanyName;

module.exports = service;

function getListCompanyName(keySearch) {
    var deferred = Q.defer();

    request.post({
        headers: {
            'Authorization': "Bearer " + config.tokenBE
        },
        url: config.beUrl + "/api/form/ep_companies/lookup",
        form: {name: keySearch},
        json: true
    }, function (error, response, body) {
        if (body) {
            deferred.resolve({
                statusCode: 200,
                data: body
            });
        } else {
            deferred.resolve({
                statusCode: 403,
                message: "Data empty"
            });
        }
    });

    return deferred.promise;
}