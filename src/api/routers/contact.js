import { Router } from 'express';
import { requestContact, acceptContact } from './../controllers/contact';

export default ({ config, db }) => {
	let api = Router();

	api.post('/', requestContact);
	api.put('/:id/accept', acceptContact);
    
	return api;
}