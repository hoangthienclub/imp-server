import fs from 'fs';
import Response from './../../models/response';
import { mapMessage } from './../../utils/mapping';
import { create, find, findById, update, deleteFn } from '../../utils/handle';
import { popMsgUser, popContact } from '../../utils/popDbUser'; 

module.exports = {
    create: async (req, res, next) => {
        try {
            const newResponse = await create(Response, {...req.body, creatorId: req.user._id});
            res.data = await popContact(req.dbUser, newResponse);
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },

    getList: async (req, res, next) => {
        try {
            const listResponse = await find(Response, {creatorId: req.user._id})
            res.data = await popMsgUser(req.dbUser, listResponse);
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },

    deleteContact: async (req, res, next) => {
        try {
            await Response.deleteOne({
                _id: req.params.id,
                creatorId: req.user._id
            });
            res.data = {};
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    }
}