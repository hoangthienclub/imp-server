import fs from 'fs';
import Coupon from './../../models/coupon';
import { mapMessage } from './../../utils/mapping';
import { create} from '../../utils/handle';

module.exports = {

    getCoupon: async (req, res, next) => {
        
    },

    recivedCoupon: async (req, res, next) => {
        try {
            const newCoupon = await create(Coupon, req.body);
            res.data = newCoupon;
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },

    getCouponDetail: async (req, res, next) => {
    },

    applyCoupon: async (req, res, next) => {
    },
}