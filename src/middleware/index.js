import { Router } from 'express';
import jwt from 'jsonwebtoken';

export default ({ config, db }) => {
	let routes = Router();

	routes.use(function async(req, res, next) {
		const userDecode = jwt.decode(req.token, process.env.JWT_KEY);
		req.user = userDecode;
		next();
	})
	// add middleware here
	return routes;
}

