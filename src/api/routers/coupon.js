import { Router } from 'express';
import { getCoupon, recivedCoupon, getCouponDetail, applyCoupon } from './../controllers/coupon';

export default ({ config, db }) => {
	let api = Router();

	api.get('/', getCoupon);
	api.post('/', recivedCoupon);
    api.get('/:couponId', getCouponDetail);
    api.post('/:couponId/apply', applyCoupon);
    
	return api;
}