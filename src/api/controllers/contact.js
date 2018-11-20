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

    acceptContact: async (req, res, next) => {
        try {
            const updateContact = await Contact.findOneAndUpdate({
                _id: req.params.id,
                creatorId: req.user._id
            }, {
                status: 1
            });
            if (updateContact) {
                await create(Contact, {
                    userId: req.user._id,
                    creatorId: req.body.userId,
                    status: 1
                })
                res.data = await popContact(req.dbUser, updateContact);
                next();
            }
            else {
                next('Do not have permission!');
            }
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    }
}