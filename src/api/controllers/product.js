import fs from 'fs';
import Product from './../../models/product';
import { mapMessage } from './../../utils/mapping';
import { create, find, findById, update, deleteFn } from '../../utils/handle';
import { popProduct } from '../../utils/populate'; 

module.exports = {
    createProduct: async (req, res, next) => {
        try {
            const newProduct = await create(Product, {...req.body, companyId: req.user.companyId});
            res.data = await popProduct(Product, newProduct);
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },

    getProduct: async (req, res, next) => {
        try {
            const products = await find(Product);
            res.data = await popProduct(Product, products);
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },

    getProductDetail: async (req, res, next) => {
        try {
            const product = await findById(Product, req.params.id);
            res.data = await popProduct(Product, product);
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },

    updateProduct: async (req, res, next) => {
        try {
            const updateProduct = await update(Product, {...req.body, _id: req.params.id });
            res.data = await popProduct(Product, updateProduct);
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },

    deleteProduct: async (req, res, next) => {
        try {
            await deleteFn(Product, req.param.id );
            res.data = {};
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },
}