import { Router } from 'express';
import { createProduct, getProduct, getProductDetail, updateProduct, deleteProduct} from './../controllers/product';

export default ({ config, db }) => {
	let api = Router();

	api.get('/', getProduct);
	api.post('/', createProduct);
    api.get('/:id', getProductDetail);
    api.put('/:id', updateProduct);
    api.delete('/:id', deleteProduct);
    
	return api;
}