import { Router } from 'express';
import { getMessages, getFiles } from './../controllers/message';

export default ({ config, db }) => {
	let api = Router();

	api.get('/', getMessages);
	api.get('/files', getFiles);
	return api;
}
