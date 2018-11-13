import { version } from '../../package.json';
import { Router } from 'express';
import message from './routers/message';
import file from './routers/file';
import product from './routers/product';
import category from './routers/category';
import couponroot from './routers/couponRoot';
import coupon from './routers/coupon';
import buildResponse from './../lib/buildResponse';
import { MongoClient} from 'mongodb';

export default ({ config, dbUser }) => {
	let api = Router();
	api.use(function (req, res, next) {
		try {
			if (req.user) {
				req.user = req.user.user;
				next();
			}
			else {
				next(`Dont't have permission!`);
			}
		}
		catch (err) {
			console.log(err)
			next(err)
		}
	});
	// mount the facets resource
	api.use('/message', message({ config, dbUser }));
	api.use('/file', file({ config, dbUser }));
	api.use('/product', product({ config, dbUser }));
	api.use('/category', category({ config, dbUser }));
	api.use('/couponroot', couponroot({ config, dbUser }));
	api.use('/coupon', coupon({ config, dbUser }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	buildResponse(api)
	return api;
}