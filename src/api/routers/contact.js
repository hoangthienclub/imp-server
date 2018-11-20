import { Router } from 'express';
import { requestContact, acceptContact, rejectContact } from './../controllers/contact';

export default ({ config, db }) => {
	let api = Router();

	api.post('/', requestContact);
	api.put('/:id/accept', acceptContact);
	api.put('/:id/reject', rejectContact);
    
	return api;
}