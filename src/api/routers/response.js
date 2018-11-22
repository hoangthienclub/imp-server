import { Router } from 'express';
import { create, getList, deleteResponse, updateResponse } from './../controllers/response';

export default ({ config, db }) => {
	let api = Router();

	api.get('/', getList);
	api.post('/', create);
	api.delete('/:id', deleteResponse);
	api.put('/:id', updateResponse);
    
	return api;
}