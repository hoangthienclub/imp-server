import fs from 'fs';
import Category from './../../models/category';
import { mapMessage } from './../../utils/mapping';
import { create, find, findById, update, deleteFn } from '../../utils/handle';

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
        try {
            const listCategory = await find(Category)
            res.data = listCategory;
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },

    getCategoryDetail: async (req, res, next) => {
        try {
            const listCategory = await findById(Category, req.params.id)
            res.data = listCategory;
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },

    updateCategory: async (req, res, next) => {
        try {
            const update = await update(Category, { ...req.body, _id: req.params.id });
            res.data = update;
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },

    deleteCategory: async (req, res, next) => {
        try {
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