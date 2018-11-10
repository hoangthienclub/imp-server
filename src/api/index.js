import { version } from '../../package.json';
import { Router } from 'express';
import message from './routers/message';
import file from './routers/file';
import product from './routers/product';
import category from './routers/category';
import couponroot from './routers/couponroot';
import coupon from './routers/coupon';
import buildResponse from './../lib/buildResponse';

export default ({ config, db }) => {
	let api = Router();
	api.use(function (req, res, next) {
		req.user = {
			companyId: 'horical'
		}
		next();
	});
	// mount the facets resource
	api.use('/message', message({ config, db }));
	api.use('/file', file({ config, db }));
	api.use('/product', product({ config, db }));
	api.use('/category', category({ config, db }));
	api.use('/couponroot', couponroot({ config, db }));
	api.use('/coupon', coupon({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	buildResponse(api)
	return api;
}

