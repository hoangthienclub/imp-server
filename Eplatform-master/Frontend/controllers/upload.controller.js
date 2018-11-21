var express = require('express');
var router = express.Router();
// var fs = require('fs');
// var config = require('config.json');
// var jwt = require('jsonwebtoken');
// var typeValidate = require("../utils/type.validate");
// var request = require('request');

// router.get('/', function (req, res) {
//     fs.readFile('./images/filename.jpg', function (err, data) {
// 		if (err) {
// 			throw err; 
//         }
        
// 		res.end(data, 'binary');
// 	});
// });

// router.post('/', function (req, res) {
//     if (req.session.token && req.session.token == req.body.user_token) {
//         let decodeData = jwt.decode(req.session.token, config.secret);

//         if (typeValidate.validateObjectId(decodeData.sub)) {
//             if (Object.keys(req.files).length == 0) {
//                 return res.send({
//                     statusCode: 400,
//                     message: 'No files were uploaded.'
//                 });
//             }
        
//             // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
//             // let sampleFile = req.files.file;
//             console.log(req.files.file)

//                 request.post({
//                     headers: {
//                         'Authorization': "Bearer " + req.session.token
//                     },
//                     url: config.ssoUrl + "/api/users/uploadImage?uid=" + decodeData.sub,
//                     form: {
//                         url: '/images/' + req.body.folder + '/' + decodeData.sub + '.jpg',
//                         type: req.body.folder,
//                         urlSaveImage: './images/' + req.body.folder + '/' + decodeData.sub + '.jpg',
//                         sampleFiles: req.files.file
//                     },
//                     json: true
//                 }, function (error, response, body) {
//                     // if (body.statusCode == 200) {
//                     //     res.send({
//                     //         message: 'File uploaded!',
//                     //         statusCode: 200
//                     //     });
//                     // } else {
//                     //     res.send({
//                     //         message: 'Err',
//                     //         statusCode: 403
//                     //     });
//                     // }
//                 });
        
//             // Use the mv() method to place the file somewhere on your server
//             // sampleFile.mv('./images/' + req.body.folder + '/' + decodeData.sub + '.jpg', function (err) {
//             //     if (err)
//             //         return res.send({
//             //             statusCode: 500,
//             //             err: err
//             //         });
        
//             //     request.post({
//             //         headers: {
//             //             'Authorization': "Bearer " + req.session.token
//             //         },
//             //         url: config.ssoUrl + "/api/users/uploadImage?uid=" + decodeData.sub,
//             //         form: {
//             //             url: '/images/' + req.body.folder + '/' + decodeData.sub + '.jpg'
//             //         },
//             //         json: true
//             //     }, function (error, response, body) {
//             //         // if (body.statusCode == 200) {
//             //         //     res.send({
//             //         //         message: 'File uploaded!',
//             //         //         statusCode: 200
//             //         //     });
//             //         // } else {
//             //         //     res.send({
//             //         //         message: 'Err',
//             //         //         statusCode: 403
//             //         //     });
//             //         // }
//             //     });
//             // });
//         } else {
//             res.send({
//                 message: 'No user id',
//                 statusCode: 403
//             });
//         }
//     } else {
//         res.send({
//             message: 'Err!',
//             statusCode: 401
//         });
//     }
// });

module.exports = router;