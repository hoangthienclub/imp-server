import { Router } from 'express';
import { createCategory, getCategory, getCategoryDetail, updateCategory, deleteCategory } from './../controllers/category';

export default ({ config, db }) => {
	let api = Router();

	api.get('/', getCategory);
	api.post('/', createCategory);
    api.get('/:id', getCategoryDetail);
    api.put('/:id', updateCategory);
    api.delete('/:id', deleteCategory);
    
	return api;
}