import { Router } from 'express';
import { createProduct, getProduct, getProductDetail, updateProduct, deleteProduct} from './../controllers/product';

export default ({ config, db }) => {
	let api = Router();

	api.get('/', getProduct);
	api.post('/', createProduct);
    api.get('/:productId', getProductDetail);
    api.put('/:productId', updateProduct);
    api.delete('/:productId', deleteProduct);
    
	return api;
}