import fs from 'fs';
import Contact from './../../models/contact';
import { mapMessage } from './../../utils/mapping';
import { create, find, findById, update, deleteFn } from '../../utils/handle';
import { popContact } from '../../utils/popDbUser'; 

module.exports = {
    requestContact: async (req, res, next) => {
        try {
            const oldContact = await Contact.findOne({
                $or : [
                    {
                        creatorId: req.user._id,
                        userId: req.body.userId
                    },
                    {
                        userId: req.user._id,
                        creatorId: req.body.userId
                    },
                ]
              
            })
            if (oldContact) {
                res.data = await popContact(req.dbUser, oldContact);
                next();
            }
            else {
                const newContact = await create(Contact, {
                    creatorId: req.user._id,
                    userId: req.body.userId
                });
                res.data = await popContact(req.dbUser, newContact);
                next();
            }
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