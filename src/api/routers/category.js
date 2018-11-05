import { Router } from 'express';
import { createCategory, getCategory, getCategoryDetail, updateCategory, deleteCategory } from './../controllers/category';

export default ({ config, db }) => {
	let api = Router();

	api.get('/', getCategory);
	api.post('/', createCategory);
    api.get('/:categoryId', getCategoryDetail);
    api.put('/:categoryId', updateCategory);
    api.delete('/:categoryId', deleteCategory);
    
	return api;
}