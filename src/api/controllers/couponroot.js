import fs from 'fs';
import CouponRoot from './../../models/couponroot';
import Coupon from './../../models/coupon';
import { mapMessage } from './../../utils/mapping';
import { create, find, findById, update, deleteFn } from '../../utils/handle';
import { generate } from 'randomstring';

module.exports = {
    createCouponRoot: async (req, res, next) => {
        try {
            req.body.creatorId = '5be68168de375d160c9c2cd8';
            req.body.companyId = '5be68168de375d160c9c2cd8';
            req.body.hashCode = generate();
            const newCouponRoot = await create(CouponRoot, req.body);
            res.data = newCouponRoot;
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },

    getCouponRoot: async (req, res, next) => {
        try {
            const newCouponRoot = await find(CouponRoot);
            res.data = newCouponRoot;
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
            res.data = couponRoot;
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
            res.data = updateCouponRoot;
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
            let arr = req.body.map(key => {
                return new Promise((resolve, reject) => {
                    create(Coupon, {
                        hashCode: generate(),
                        issueedToUser: key,
                        couponRootId: req.params.id
                    })
                    .then(coupon => {
                        resolve(coupon);
                    })
                })
            })
            await Promise.all(arr);
            res.data = {};
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },
}