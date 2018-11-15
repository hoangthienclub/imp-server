import { Router } from 'express';
import { createCouponRoot, getCouponRoot, getCouponDetailRoot, updateCouponRoot, deleteCouponRoot, deliveryCouponRoot } from './../controllers/couponroot';

export default ({ config, db }) => {
	let api = Router();

	api.get('/', getCouponRoot);
	api.post('/', createCouponRoot);
    api.get('/:id', getCouponDetailRoot);
    api.put('/:id', updateCouponRoot);
    api.delete('/:id', deleteCouponRoot);
    // api.post('/:id', deliveryCouponRoot);
    
	return api;
}