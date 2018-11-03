import { Router } from 'express';
import { createFile, getFile, updateFile, deleteFile, listFile } from './../controllers/file';

export default ({ config, db }) => {
	let api = Router();

	api.get('/', listFile);
	api.post('/', createFile);
    api.get('/:fileId', getFile);
    api.put('/:fileId', updateFile);
    api.delete('/:fileId', deleteFile);
    
	return api;
}