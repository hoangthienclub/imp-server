import { Router } from 'express';
import { create, deleteDevice } from './../controllers/device';

export default ({ config, db }) => {
	let api = Router();

	api.post('/', create);
	api.delete('/', deleteDevice);
    
	return api;
}