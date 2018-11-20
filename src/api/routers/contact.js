import { Router } from 'express';
import { requestContact, getCategory, getCategoryDetail, updateCategory, deleteCategory } from './../controllers/contact';

export default ({ config, db }) => {
	let api = Router();

	api.post('/', requestContact);
    
	return api;
}