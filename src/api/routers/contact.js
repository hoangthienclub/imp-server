import { Router } from 'express';
import { requestContact, acceptContact, rejectContact, deleteContact } from './../controllers/contact';

export default ({ config, db }) => {
	let api = Router();

	api.post('/', requestContact);
	api.put('/:id/accept', acceptContact);
	api.put('/:id/reject', rejectContact);
	api.delete('/:id', deleteContact);
    
	return api;
}