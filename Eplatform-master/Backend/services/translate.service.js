const Translate = require('@google-cloud/translate');
var Q = require('q');


const projectId = "smart-directory-1529916488691";
const translate = new Translate({
    keyFilename: "./services/keys/propertyhub-1511492653943.json",
});


var service = {};
service.translateText = translateText;
module.exports = service;


function translateText(text) {
    var deferred = Q.defer();
    translate
        .translate(text, "en")
        .then(results => {
            const translation = results[0];
            deferred.resolve(translation);
        })
        .catch(err => {
            console.error('ERROR:', err);
            deferred.reject(err)
        });
        

    return deferred.promise;
}

translateText("Xin chào")