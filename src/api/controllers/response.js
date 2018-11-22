import fs from 'fs';
import Response from './../../models/response';
import { mapMessage } from './../../utils/mapping';
import { create, find, findById, update, deleteFn } from '../../utils/handle';
import { popMsgUser, popContact } from '../../utils/popDbUser'; 

module.exports = {
    create: async (req, res, next) => {
        try {
            const newResponse = await create(Response, {...req.body, creatorId: req.user._id});
            res.data = newResponse;
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
            if (listResponse.length == 0) {
                const result = exampleResponse.map(async item => {
                    return await create(Response, {desc: item, creatorId: req.user._id});
                })
                await Promise.all(result);
                const listResponseExample = await find(Response, {creatorId: req.user._id})
                res.data = listResponseExample;
                next();
            }
            else {
                res.data = listResponse;
                next();
            }
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

const exampleResponse = [
    `Sorry, I missed your call`,
    `I'm running late, but I'll be there soon`,
    `How's it going?`,
    `What's up?`,
    `Where are you?`,
    `Please call me when you get this message`,
    `When can we meet`,
    `I'll talk to you soon`,
    `Where's the meeting`,
    `What's the number`
]