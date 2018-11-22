import { Router } from 'express';
import { getConversation } from './../controllers/conversation';

export default ({ config, db }) => {
	let api = Router();

	api.get('/', getConversation)
    
	return api;
}