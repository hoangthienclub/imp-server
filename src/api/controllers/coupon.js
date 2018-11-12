import fs from 'fs';
import Coupon from './../../models/coupon';
import { mapMessage } from './../../utils/mapping';
import { create, find, findById, update, deleteFn } from '../../utils/handle';
import { popCoupon } from '../../utils/populate'; 

module.exports = {

    getCoupon: async (req, res, next) => {
        try {
            let filter = {
                issueedToUser: req.user._id
            };
            if (req.query.usedDate === false) {
                filter.usedDate = {
                    $exists: false
                }
            }
            if (req.query.acceptedUser === false) {
                filter.acceptedUser = {
                    $exists: false
                }
            }
            if (req.query.issueedDate) {
                filter.issueedDate = {
                    $gte: req.query.issueedDate
                }
            }
            const list = await find(Coupon, filter);
            res.data = await popCoupon(Coupon, list);
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },

    recivedCoupon: async (req, res, next) => {
        try {
            const coupon = await update(Coupon, {
                _id: req.params.id,
                acceptedUser: req.user._id
            });
            res.data = await popCoupon(Coupon, coupon);
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
            res.data = await popCoupon(Coupon, coupon);
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
	            usedCompanyId: req.user.company._id
            });
            res.data = await popCoupon(Coupon, coupon);
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },
}