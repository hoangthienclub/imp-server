import { version } from '../../package.json';
import { Router } from 'express';
import message from './routers/message';
import file from './routers/file';
import product from './routers/product';
import category from './routers/category';
import couponroot from './routers/couponRoot';
import coupon from './routers/coupon';
import device from './routers/device';
import position from './routers/position';
import buildResponse from './../lib/buildResponse';
import { MongoClient} from 'mongodb';
import path from 'path';

export default ({ config }) => {
	let api = Router();
	api.get('/chat/demo1', (req, res) => {
		res.sendFile(path.resolve(__dirname)+'/public/index.html');
	})

	api.get('/chat/demo2', (req, res) => {
		res.sendFile(path.resolve(__dirname)+'/public/index1.html');
	})
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
	api.use('/message', message({ config }));
	api.use('/file', file({ config }));
	api.use('/product', product({ config }));
	api.use('/category', category({ config }));
	api.use('/couponroot', couponroot({ config }));
	api.use('/coupon', coupon({ config }));
	api.use('/device', device({ config }));
	api.use('/position', position({ config }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	buildResponse(api)
	return api;
}