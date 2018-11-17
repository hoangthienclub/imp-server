const authorization = process.env.pushNotificationKey;
const url = 'https://fcm.googleapis.com/fcm/send';
const alert = 'You got a meesage';
const sound = 'bingbong.aiff';
const request = require('request');

const setOptions = (body) => ({
    headers: {
        'Content-type': 'application/json',
        'Authorization': authorization
    },
    url,
    body: JSON.stringify(body)
})

module.exports = {
    push: (body) => {
        const options = setOptions(body)
        return new Promise((resolve, reject) => {
            request.post(options, err => {
                if (err) {
                    return resolve(err);
                }
                resolve({})
            })
        })
    }
}

