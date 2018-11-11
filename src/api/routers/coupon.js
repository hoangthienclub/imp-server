import { Router } from 'express';
import { getCoupon, recivedCoupon, getCouponDetail, applyCoupon } from './../controllers/coupon';

export default ({ config, db }) => {
	let api = Router();

	api.get('/', getCoupon);
	api.post('/:id', recivedCoupon);
    api.get('/:id', getCouponDetail);
    api.post('/:id/apply', applyCoupon);
    
	return api;
}