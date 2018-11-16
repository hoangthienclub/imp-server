import { Router } from 'express';

export default ({ config, db }) => {
	let api = Router();

	api.get('/', async (req, res, next) => {
		try {
			var positions = await req.dbMain.collection('ep_companyPositions').find({
				isActive: true,
				isDelete: false
			}).toArray()
			res.data = positions;
			next();
		}
		catch (err) {
			console.log(err)
			next(err);
		}
    });
    
	return api;
}