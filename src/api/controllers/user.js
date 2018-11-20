import fs from 'fs';
import { mapMessage } from './../../utils/mapping';
import { create, find, findById, update, deleteFn } from '../../utils/handle';
import { popCategory } from '../../utils/populate'; 
import mongoose from 'mongoose';

module.exports = {
    listUser: async (req, res, next) => {
        try {
            const users = await req.dbUser.collection('users').find({
                'company._id': req.query.companyId
            }).toArray();
            const userIds = users.map(user => user._id.toString());
            let levels = await req.dbMain.collection('level_current').find({uid: {$in: userIds}, status: 1, current: {$gte: 2}}).toArray();
            levels = levels.map(level => level.uid.toString());
            const listUser = [];
            users.map(user => {
                if (levels.indexOf(user._id.toString()) != -1) {
                    listUser.push(user);
                }
            });
            res.data = listUser;
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    }
}