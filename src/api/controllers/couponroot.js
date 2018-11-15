import fs from 'fs';
import CouponRoot from './../../models/couponroot';
import Coupon from './../../models/coupon';
import { mapMessage } from './../../utils/mapping';
import { create, find, findById, update, deleteFn } from '../../utils/handle';
import { generate } from 'randomstring';
import { popCouponRoot } from '../../utils/populate'; 
import { connectDbUser } from './../../databases';


module.exports = {
    createCouponRoot: async (req, res, next) => {
        try {
            req.body.hashCode = generate({
                length: 7,
                capitalization: 'uppercase'
            });
            const newCouponRoot = await create(CouponRoot, { 
                ...req.body,
                creatorId: req.user._id,
                companyId: req.user.company._id
            });
            const filter = req.body.filter;
            let listUsers;
            req.dbUser.collection('users').find().toArray()
            .then(users => {
                listUsers = users;
                const userIds = users.map(key => key._id.toString());
                return req.dbMain.collection('level_current').find({uid: {$in: userIds}, status: 1}).toArray()
            })
            .then(levels => {
                listUsers = listUsers.map(user => {
                    user.level = levels.filter(level => level.uid == user._id)[0];
                    user.age = new Date().getFullYear() - +user.yearofbirth
                    return user;
                });
                let filterGender = [];
                if (filter.gender && filter.gender.length > 0) {
                    filterGender = listUsers.filter(user => filter.gender.indexOf(+user.gender) != -1)
                }
                else {
                    filterGender = listUsers;
                }

                let filterAge = [];
                if (filter.ageFrom && filter.ageTo) {
                    filterAge = filterGender.filter(user => user.age > filter.ageFrom && user.age < filter.ageTo)
                }
                else {
                    filterAge = filterGender;
                }

                let filterPosition = [];
                if (filter.position && filter.position.length > 0) {
                    filterPosition = filterAge.filter(user => filter.position.indexOf(user.position._id.toString()) != -1)
                }
                else {
                    filterPosition = filterAge;
                }

                let filterLevel = [];
                if (filter.level && filter.level.length > 0) {
                    filterLevel = filterPosition.filter(user => {
                        var level = null;
                        if (user.level) {
                            level = user.level.current;
                        }
                        filter.level.indexOf(level) != -1
                    })
                }
                else {
                    filterLevel = filterPosition;
                }
                const userIds = filterLevel.map(user => user._id);
                let arr = userIds.map(key => {
                    return new Promise((resolve, reject) => {
                        create(Coupon, {
                            hashCode: generate({
                                length: 7,
                                capitalization: 'uppercase'
                            }),
                            issueedToUser: key,
                            couponRootId: newCouponRoot
                        })
                        .then(coupon => {
                            resolve(coupon);
                        })
                    })
                })
                Promise.all(arr)
                .then(result => {
                    return popCouponRoot(CouponRoot, newCouponRoot);
                }, next)
                .then(result => {
                    res.data = result;
                    next();
                })
                .catch(next)
            }, next)
            .catch(next)
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },

    getCouponRoot: async (req, res, next) => {
        try {
            console.log(req.user)
            let filter = {
                companyId: req.user.company._id
            };    
            if (req.query.text) {
                filter.$or = [ 
                    { name: {$regex: req.query.text, $options: 'i'}}, 
                    { desc:  {$regex: req.query.text, $options: 'i'}}
                ] 
            }
            const list = await find(CouponRoot, filter);
            res.data = await popCouponRoot(CouponRoot, list);
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },

    getCouponDetailRoot: async (req, res, next) => {
        try {
            const couponRoot = await findById(CouponRoot, req.params.id);
            res.data = await popCouponRoot(CouponRoot, couponRoot);
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },

    updateCouponRoot: async (req, res, next) => {
        try {
            const updateCouponRoot = await update(CouponRoot, { ...req.body, _id: req.params.id });
            res.data = await popCouponRoot(CouponRoot, updateCouponRoot);
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },

    deleteCouponRoot: async (req, res, next) => {
        try {
            await deleteFn(CouponRoot, req.params.id);
            res.data = {};
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },

    deliveryCouponRoot: async (req, res, next) => {
        try {
            const filter = req.body;
            let listUsers;
            req.dbUser.collection('users').find().toArray()
            .then(users => {
                listUsers = users;
                const userIds = users.map(key => key._id.toString());
                return req.dbMain.collection('level_current').find({uid: {$in: userIds}, status: 1}).toArray()
            })
            .then(levels => {
                listUsers = listUsers.map(user => {
                    user.level = levels.filter(level => level.uid == user._id)[0];
                    user.age = new Date().getFullYear() - +user.yearofbirth
                    return user;
                });
                let filterGender = [];
                if (filter.gender && filter.gender.length > 0) {
                    filterGender = listUsers.filter(user => filter.gender.indexOf(+user.gender) != -1)
                }
                else {
                    filterGender = listUsers;
                }

                let filterAge = [];
                if (filter.ageFrom && filter.ageTo) {
                    filterAge = filterGender.filter(user => user.age > filter.ageFrom && user.age < filter.ageTo)
                }
                else {
                    filterAge = filterGender;
                }

                let filterPosition = [];
                if (filter.position && filter.position.length > 0) {
                    filterPosition = filterAge.filter(user => filter.position.indexOf(user.position._id.toString()) != -1)
                }
                else {
                    filterPosition = filterAge;
                }

                let filterLevel = [];
                if (filter.level && filter.level.length > 0) {
                    filterLevel = filterPosition.filter(user => filter.level.indexOf(user.level.current) != -1)
                }
                else {
                    filterLevel = filterPosition;
                }
                const userIds = filterLevel.map(user => user._id);
                let arr = userIds.map(key => {
                    return new Promise((resolve, reject) => {
                        create(Coupon, {
                            hashCode: generate({
                                length: 7,
                                capitalization: 'uppercase'
                            }),
                            issueedToUser: key,
                            couponRootId: req.params.id
                        })
                        .then(coupon => {
                            resolve(coupon);
                        })
                    })
                })
                Promise.all(arr)
                .then(result => {
                    res.data = {};
                    next();
                }, next)
                .catch(next)
            }, next)
            .catch(next)
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },
}