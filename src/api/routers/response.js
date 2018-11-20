import { Router } from 'express';
import { create, getList, deleteContact } from './../controllers/response';

export default ({ config, db }) => {
	let api = Router();

	api.get('/', getList);
	api.post('/', create);
	api.delete('/:id', deleteContact);
    
	return api;
}