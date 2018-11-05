import { Router } from 'express';
import { createCouponRoot, getCouponRoot, getCouponDetailRoot, updateCouponRoot, deleteCouponRoot, deliveryCouponRoot } from './../controllers/couponroot';

export default ({ config, db }) => {
	let api = Router();

	api.get('/', getCouponRoot);
	api.post('/', createCouponRoot);
    api.get('/:couponRootId', getCouponDetailRoot);
    api.put('/:couponRootId', updateCouponRoot);
    api.delete('/:couponRootId', deleteCouponRoot);
    api.post('/:couponRootId', deliveryCouponRoot);
    
	return api;
}