import fs from 'fs';
import Coupon from './../../models/coupon';
import { mapMessage } from './../../utils/mapping';
import { create, find, findById, update, deleteFn } from '../../utils/handle';

module.exports = {

    getCoupon: async (req, res, next) => {
        try {
            req.user = {};
            req.user._id = '5be7af9baf3c452fe1bd1288';
            const newCoupon = await find(Coupon, { issueedToUser: req.user._id });
            res.data = newCoupon;
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },

    recivedCoupon: async (req, res, next) => {
        try {
            req.user = {};
            req.user._id = '5be7af9baf3c452fe1bd1288';
            const newCoupon = await update(Coupon, {
                _id: req.params.id,
                acceptedUser: req.user._id
            });
            res.data = newCoupon;
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },

    getCouponDetail: async (req, res, next) => {
        try {
            const coupon = await findById(Coupon, req.params.id);
            res.data = coupon;
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },

    applyCoupon: async (req, res, next) => {
        try {
            const coupon = await update(Coupon, {
                _id: req.params.id,
                usedDate: new Date(),
	            usedCompanyId: req.body.companyId 
            });
            res.data = coupon;
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },
}