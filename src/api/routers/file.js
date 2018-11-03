import { Router } from 'express';
import { createFile, getFile, updateFile, deleteFile } from './../controllers/file';

export default ({ config, db }) => {
	let api = Router();

	api.post('/', createFile);
    api.get('/:fileId', getFile);
    api.put('/:fileId', updateFile);
    api.delete('/:fileId', deleteFile);
    
	return api;
}