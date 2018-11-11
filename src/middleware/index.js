import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { MongoClient } from 'mongodb';

export default ({ config, db }) => {
	let routes = Router();

	routes.use(function (req, res, next) {
		const userDecode = jwt.decode(req.token, process.env.JWT_KEY);
		req.user = userDecode;
		MongoClient.connect(`${process.env.MONGO_USER_URI}/${process.env.MONGO_USER_DB}`, function (err, client) {
			if (err) {
				console.log('err:',err)
				next(err);
			}
			const db = client.db('user-management');
			req.db = db;
			next();
		})
	})
	// add middleware here
	return routes;
}

