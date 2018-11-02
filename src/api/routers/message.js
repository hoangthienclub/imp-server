import { Router } from 'express';

export default ({ config, db }) => {
	let api = Router();

	api.get('/', (req, res, next) => {
		res.data = 'thien';
		next({
			message: 'THIEN'
		});
	});
	return api;
}
