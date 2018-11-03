import { Router } from 'express';
import { createFile, getFile } from './../controllers/file';

export default ({ config, db }) => {
	let api = Router();

	api.post('/', createFile);
    api.get('/:fileId', getFile);
    
	return api;
}