var Q = require('q');
var fs = require('fs');

var service = {};

service.getViewLang = getViewLang;

module.exports = service;

function readJson(file, lang = "en") {
    var deferred = Q.defer();
    fs.readFile('./views/lang/' + lang + "/" + file + ".json", 'utf8', function (err, data) {
        if (err) {
            deferred.resolve({});
        }
        if (data) {
            try {
                deferred.resolve(JSON.parse(data));
            } catch (ex) {
                console.log('./views/lang/' + lang + "/" + file + ".json")
                console.log(ex);
            }
        } else {
            deferred.resolve({});
        }
    });

    return deferred.promise;
}

function getViewLang(views, lang = "en") {
    var deferred = Q.defer();
    var promises = [];
    views.forEach(function (e) {
        promises.push(readJson(e, lang))
    })
    Q.all(promises)
        .then (function (res) {
            var obj = {};
            res.forEach(function (e) {
                Object.assign(obj, e);
            }, this);

            deferred.resolve(obj);
        })
        .catch(function (err) {
            deferred.reject(err);
        });
    
    return deferred.promise;
}
