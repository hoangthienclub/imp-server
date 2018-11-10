import fs from 'fs';
import Product from './../../models/product';
import { mapMessage } from './../../utils/mapping';
import { create} from '../../utils/handle';

module.exports = {
    createProduct: async (req, res, next) => {
        try {
            const newProduct = await create(Product, {...req.body, companyId: req.user.companyId});
            res.data = newProduct;
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },

    getProduct: async (req, res, next) => {
    },

    getProductDetail: async (req, res, next) => {
    },

    updateProduct: async (req, res, next) => {
    },

    deleteProduct: async (req, res, next) => {
    },
}