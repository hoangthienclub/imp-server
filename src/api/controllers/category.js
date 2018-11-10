import fs from 'fs';
import Category from './../../models/category';
import { mapMessage } from './../../utils/mapping';
import { create} from '../../utils/handle';

module.exports = {
    createCategory: async (req, res, next) => {
        try {
            const newCategory = await create(Category, req.body);
            res.data = newCategory;
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },

    getCategory: async (req, res, next) => {
    },

    getCategoryDetail: async (req, res, next) => {
    },

    updateCategory: async (req, res, next) => {
    },

    deleteCategory: async (req, res, next) => {
    },
}