var Q = require("q");
var express = require('express');
var router = express.Router();
var request = require('request');
var userService = require("../../services/user.service");
var langService = require("../../services/lang.service");
var config = require('config.json');
var verify = require('utils/verify');
var jwt = require('jsonwebtoken');

// routes
router.post('/authenticate', authenticateUser);
router.post('/register', registerUser);
router.get('/current', getCurrentUser);
router.post('/updateUser', updateUser);
router.delete('/:_id', deleteUser);
router.post('/upgradelevel', upgradeUser);
router.get('/getcurrentlevel', getCurrentLevel);
router.get('/approve', approve);
router.get('/getAllUser', getAllUser);
router.get('/getUserById', getUserById);
router.post('/searchUser', searchUser);
router.post('/uploadImage', uploadImage);

module.exports = router;

function authenticateUser(req, res) {
    if (req.body.token && req.body.uid) {
        let decodeData = jwt.decode(req.body.token, config.secret);
        if (decodeData.sub == req.body.uid) {
            userService.saveUserId(req.body.uid);
            res.send({
                statusCode: 200,
                token: req.body.token
            })
        } else {
            res.send({
                statusCode: 403,
                message: "Đăng nhập thất bại"
            })
        }
    } else {
        res.send({
            statusCode: 403,
            message: "Missing fields"
        });
    }
}

function upgradeUser(req, res) {
    var userId = req.query.uid;

    if (userId) {
        request.get({
            headers: {
                'Authorization': "Bearer " + req.body.token
            },
            url: config.ssoUrl + '/api/users/getCurrentUser?uid=' + userId,
            json: true
        }, function (error, response, body) {
            userService.getInfoLevelById(userId)
                .then(function (info) {
                    userService.getFieldNextLevel(info.current)
                        .then(function (data) {
                            if (data) {
                                console.log(verify.verifyData(body.user, data))
                                if (verify.verifyData(body.user, data).length > 0) {
                                    res.send({
                                        statusCode: 403,
                                        message: "Missing fields",
                                        fieldMissing: verify.verifyData(body.user, data)
                                    });
                                } else {
                                    userService.updateStatus(userId, 2);
                                    res.send({
                                        statusCode: 200,
                                        message: "Pending approve"
                                    });
                                }
                            } else {
                                res.send({
                                    statusCode: 403,
                                    message: "Error upgrade level"
                                });
                            }
                        })
                        .catch(function (err) {
                            res.send({
                                statusCode: 403,
                                message: "Missing fields"
                            });
                        });
                })
                .catch(function (err) {
                    res.send({
                        statusCode: 403,
                        message: "User not level"
                    });
                })
        });
    } else {
        res.send({
            statusCode: 403,
            message: "Missing fields"
        });
    }
}

function getCurrentLevel(req, res) {
    var userId = req.query.uid;
    userService.getInfoLevelById(userId)
        .then(function (data) {
            if (data) {
                res.send({
                    statusCode: 200,
                    data: {
                        currentLevel: data.current,
                        statusLevel: data.status
                    }
                });
            } else {
                res.send({
                    statusCode: 403,
                    message: "User not level"
                });
            }
        })
        .catch(function (err) {
            res.send({
                statusCode: 500,
                message: err
            });
        })
}

function approve(req, res) {
    var userId = req.query.uid;
    var status = 1;
    if (req.query.status != "true") {
        status = 3;
    }
    userService.updateLevel(userId, status)
        .then(function (data) {
            if (data) {
                res.send({
                    statusCode: 200,
                    data: data
                });
            } else {
                res.send({
                    statusCode: 403,
                    message: "User not level"
                });
            }
        })
        .catch(function (err) {
            res.send({
                statusCode: 500,
                err: err
            });
        })
}

function getAllUser(req, res) {
    var token = req.query.token;

    request.get({
        headers: {
            'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1YmQ0MTAwMTg5NTE3OTJjNjQ0NWI4YzYiLCJ1c2VyIjp7Il9pZCI6IjViZDQxMDAxODk1MTc5MmM2NDQ1YjhjNiIsImZ1bGxuYW1lIjoiSG_DoG5nIEtpbSBUdeG6pW4iLCJ1c2VybmFtZSI6IkhvYW5nS2ltVHVhbiIsImctcmVjYXB0Y2hhLXJlc3BvbnNlIjoiIiwiaGFzaCI6IiQyYSQxMCRUZnBBME5BbzUwdUVKYXE5dFY4dnJ1MTU3ZC4uYmc3d1Jud3VlNm9HWDhPUFg2ZkZWUVNFUyIsInBob25lIjoiMDk2OTk4NzU0OCIsImNvdW50cnljb2RlIjoiKzg0IiwibW9kdGltZSI6IjE1NDI2MTg5NTA5MjEiLCJjb3ZlciI6eyJ1cmwiOiJodHRwOi8vc3NvLm5zby52bi9pbWFnZXMvYmFubmVycy81YmQ0MTAwMTg5NTE3OTJjNjQ0NWI4YzYuanBnP2RhdGU9MTU0MTkyODkxMTY3MSIsIl9pZCI6IjViZTdmN2NmMDAzMTIyMTJhMDE3YzUyNyJ9LCJpbnRyb2R1Y3Rpb24iOiJEZW1vIiwieWVhcm9mYmlydGgiOiIxOTk2IiwiZ2VuZGVyIjoiMSIsImVtYWlsIjoiaG9hbmdraW10dWFuMTk5NkBnbWFpbC5jb20iLCJhZGRyZXNzIjoiUXVhbiA5IiwiYXZhdGFyIjp7InVybCI6Imh0dHA6Ly9zc28ubnNvLnZuL2ltYWdlcy9hdmF0YXJzLzViZDQxMDAxODk1MTc5MmM2NDQ1YjhjNi5qcGc_ZGF0ZT0xNTQyNDUyMDY4ODgzIiwiX2lkIjoiNWJlZmYzNjQwZTdmYzUyZTIwNjBiMjlkIn0sImNhcmR2aXNpdCI6eyJ1cmwiOiJodHRwOi8vc3NvLm5zby52bi9pbWFnZXMvY2FyZHMvNWJkNDEwMDE4OTUxNzkyYzY0NDViOGM2LmpwZz9kYXRlPTE1NDIxMjk5NDgwNzkiLCJfaWQiOiI1YmViMDkxY2Y1NjU5MjI1NjA1NTUzOTUifSwiY29tcGFueSI6eyJfaWQiOiI1YjA2NGI4NGRjOTc1MzA5YjhmYWI2YTQiLCJuYW1lIjoiQkVITiBNRVlFUiBDby4sTHRkIiwiaXNTdG9yZSI6ZmFsc2UsInVybCI6ImJlaG4tbWV5ZXItY29sdGQifSwidGF4bnVtYmVyIjoiMTIzNDU2Iiwic3BlYWtpbmdsYW5ndWFnZXMiOiJFbmdsaXNoIiwicG9zaXRpb24iOnsibmFtZSI6IlByZXNpZGVudCIsIl9pZCI6IjViMDYyZTMxZGM5NzUzMTA1YzM4ZGExNiJ9LCJhZ3JlZW1lbnQiOnsidXJsIjoiaHR0cDovL3Nzby5uc28udm4vcGRmcy9hZ3JlZW1lbnRzLzE1NjAgY8OidSBUb2VpYyBjw7MgZ2nhuqNpIHRow61jaC5wZGY_ZGF0ZT0xNTQyNjE4NDUzOTA3IiwiX2lkIjoiNWJmMjdkNTUyZDgwYzAwYTcwZGU5MzNjIn0sImlkZW50aXR5Y2FyZCI6eyJ1cmwiOiJodHRwOi8vc3NvLm5zby52bi9pbWFnZXMvaWRlbnRpdHlzLzViZDQxMDAxODk1MTc5MmM2NDQ1YjhjNi5qcGc_ZGF0ZT0xNTQyMTMwMDUzOTA4IiwiX2lkIjoiNWJlYjA5ODVmNTY1OTIyNTYwNTU1Mzk3In0sInNvY2lhbG1lZGlhbGluayI6IkRlbW8ifSwiaWF0IjoxNTQyNjIxNjI5fQ.12CNHtih-ZtrgyYOa2txnUN5AeGpBSqBvpwU-jq2wS4"
        },
        url: config.ssoUrl + "/api/users/getAllUser?token=" + token,
        json: true
    }, function (error, response, body) {
        if (body.statusCode == 200) {
            let promises = [];
            var data = body.data;
            for (let i in data) {
                promises.push(userService.getInfoLevelById(data[i]._id));
            }
            Q.all(promises)
                .then(function (arr) {
                    if (arr) {
                        let result = [];
                        for (i in arr) {
                            if (arr[i]) {
                                data[i].companyId = arr[i].companyId;
                                result.push(data[i]);
                            }
                        }
                        res.send({
                            statusCode: 200,
                            data: result
                        });
                    } else {
                        res.send({
                            statusCode: 403,
                            message: 'User empty'
                        });
                    }
                })
                .catch(function (err) {
                    res.send({
                        statusCode: 500,
                        err: err
                    });
                })
        } else {
            res.send({
                statusCode: 403,
                message: "Request error"
            });
        }
    });
}

function getUserById(req, res) {
    var uid = req.query.uid;
    userService.getById(uid, req.user.token)
        .then(function(data) {
            res.send(data);
        })
        .catch(function(err) {
            res.send(err);
        });
}

function searchUser(req, res) {
    var token = req.query.token;

    request.post({
        headers: {
            'Authorization': "Bearer " + req.user.token
        },
        url: config.ssoUrl + "/api/users/getUserWithKey?token=" + token,
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (body.statusCode == 200) {
            let promises = [];
            var data = body.data;
            for (let i in data) {
                promises.push(userService.getInfoLevelById(data[i]._id));
            }
            Q.all(promises)
                .then(function (arr) {
                    if (arr) {
                        let result = [];
                        for (i in arr) {
                            if (arr[i]) {
                                data[i].companyId = arr[i].companyId;
                                result.push(data[i]);
                            }
                        }
                        res.send({
                            statusCode: 200,
                            data: result
                        });
                    } else {
                        res.send({
                            statusCode: 403,
                            message: 'User empty'
                        });
                    }
                })
                .catch(function (err) {
                    res.send({
                        statusCode: 500,
                        err: err
                    });
                })
        } else {
            res.send({
                statusCode: 403,
                message: "Request error"
            });
        }
    });
}

function registerUser(req, res) {
    userService.create(req.body)
        .then(function () {
            promises = [langService.getViewLang(["modals/signup/success"], req.language)]
            Q.all(promises)
                .then(function (arr) {
                    res.render(req.platform + "modals/success", {
                        langData: arr[0]
                    })
                })
                .catch(function (err) {
                    res.status(510).send(err);
                })
        })
        .catch(function (err) {
            promises = [langService.getViewLang(["modals/signup/fail"], req.language)];
            Q.all(promises)
                .then(function (arr) {
                    res.render(req.platform + "modals/fail", {
                        langData: arr[0],
                        key: err
                    })
                })
                .catch(function (err) {
                    res.status(510).send(err);
                })
        });
}

function getCurrentUser(req, res) {
    console.log(req.user);
    // userService.getById(req.user.sub)
    //     .then(function (user) {
    //         if (user) {
    //             res.send(user);
    //         } else {
    //             res.sendStatus(404);
    //         }
    //     })
    //     .catch(function (err) {
    //         res.status(400).send(err);
    //     });
}

function updateUser(req, res) {
    var userId = req.user.sub;
    if (req.query.uid !== userId) {
        // can only update own account
        return res.send('You can only update your own account');
    }

    userService.update(userId, req.user.token)
        .then(function (data) {
            res.send({
                statusCode: 200
            });
        })
        .catch(function (err) {
            res.send({
                statusCode: 500,
                err: err
            });
        });
}

function deleteUser(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only delete own account
        return res.status(401).send('You can only delete your own account');
    }

    userService.delete(userId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function uploadImage(req, res) {
    userService.uploadImage(req.body.url)
        .then(function (data) {
            userService.update(req.user.sub, req.body.token, {avatar: data})
                .then(function(avatar) {
                    if (data) {
                        res.send({
                            statusCode: 200
                        });
                    } else {
                        res.send({
                            statusCode: 403
                        });
                    }
                })
                .catch(function (err) {
                    res.send({
                        statusCode: 500,
                        err: err
                    });
                });
        })
        .catch(function (err) {
            res.send({
                statusCode: 500
            });
        });
}