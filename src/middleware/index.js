import { Router } from 'express';
import jwt from 'jsonwebtoken';
import {  connectDbUser, connectDBMain } from './../databases';

export default ({ config }) => {
	let routes = Router();

	routes.use(async(req, res, next) => {
		const userDecode = jwt.decode(req.token, process.env.JWT_KEY);
		req.user = userDecode;
		req.dbUser = await connectDbUser();
		req.dbMain = await connectDBMain();
		next();
	})
	// add middleware here
	return routes;
}

