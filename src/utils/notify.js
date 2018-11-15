const constant = require('../utils/constant');
const authorization = `key=${constant.pushNotificationKey}`;//new
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

const data = {
    title: 'RECEIVE COUPON',
    body: 'RECEIVE COUPON',
    alert : alert,
    identify: 'data',
    action: 'data',
    desc: 'data input',
    sound : sound
}

const input = {
    notification: data,
    data: data,
    registration_ids: tokens
}

await notifyService.push(input);
