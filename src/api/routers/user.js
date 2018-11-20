import { Router } from 'express';
import { listUser } from './../controllers/user';

export default ({ config, db }) => {
	let api = Router();

	api.get('/', listUser);
    
	return api;
}