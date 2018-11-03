import { Router } from 'express';
import { getMessages } from './../controllers/message';

export default ({ config, db }) => {
	let api = Router();

	api.get('/', getMessages);
	return api;
}
