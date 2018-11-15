import fs from 'fs';
import Category from './../../models/category';
import { mapMessage } from './../../utils/mapping';
import { create, find, findById, update, deleteFn } from '../../utils/handle';
import { popCategory } from '../../utils/populate'; 

module.exports = {
    createCategory: async (req, res, next) => {
        try {
            const newCategory = await create(Category, {...req.body, companyId: req.user.companyId});
            res.data = await popCategory(Category, newCategory);
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },

    getCategory: async (req, res, next) => {
        try {
            const listCategory = await find(Category)
            res.data = await popCategory(Category, listCategory);
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },

    getCategoryDetail: async (req, res, next) => {
        try {
            const category = await findById(Category, req.params.id)
            res.data = await popCategory(Category, category);
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },

    updateCategory: async (req, res, next) => {
        try {
            const updateCategory = await update(Category, { ...req.body, _id: req.params.id });
            res.data = await popCategory(Category, updateCategory);
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },

    deleteCategory: async (req, res, next) => {
        try {
            console.log(req.params.id)
            await deleteFn(Category, req.params.id)
            res.data = {};
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },
}