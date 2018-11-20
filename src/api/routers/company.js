import { Router } from 'express';
import { getAll } from './../controllers/company';

export default ({ config, db }) => {
	let api = Router();

	api.get('/', getAll);
    
	return api;
}