import fs from 'fs';
import CouponRoot from './../../models/couponroot';
import { mapMessage } from './../../utils/mapping';
import { create} from '../../utils/handle';

module.exports = {
    createCouponRoot: async (req, res, next) => {
        try {
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
    },

    getCouponDetailRoot: async (req, res, next) => {
    },

    updateCouponRoot: async (req, res, next) => {
    },

    deleteCouponRoot: async (req, res, next) => {
    },

    deliveryCouponRoot: async (req, res, next) => {
    },
}