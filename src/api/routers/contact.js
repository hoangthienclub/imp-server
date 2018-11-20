import { Router } from 'express';
import { requestContact, acceptContact, rejectContact, deleteContact, blockContact, unBlockContact, getContact, getBlockList } from './../controllers/contact';

export default ({ config, db }) => {
	let api = Router();

	api.post('/', requestContact);
	api.put('/:id/accept', acceptContact);
	api.put('/:id/reject', rejectContact);
	api.put('/:id/block', blockContact);
	api.put('/:id/unblock', unBlockContact);
	api.get('/list', getContact)
	api.get('/block', getBlockList)
    
	return api;
}