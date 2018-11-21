import fs from 'fs';
import Contact from './../../models/contact';
import Message from './../../models/message';
import { mapMessage } from './../../utils/mapping';
import { create, find, findById, update, deleteFn } from '../../utils/handle';
import { popContact, popUserContact } from '../../utils/popDbUser'; 

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
                userId: req.user._id
            }, {
                status: 1
            }, {
                new: true
            });
            if (updateContact) {
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
    },
    rejectContact: async (req, res, next) => {
        try {
            const rejectContact = await Contact.deleteOne({
                _id: req.params.id,
                userId: req.user._id
            });
            if (rejectContact.n != 0) {
                res.data = {};
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
    },

    blockContact: async (req, res, next) => {
        try {
            const updateContact = await Contact.findOneAndUpdate({
                _id: req.params.id,
                $or : [
                    {
                        creatorId: req.user._id
                    },
                    {
                        userId: req.user._id
                    },
                ]
            }, {
                block: true,
                blockUserId: req.user._id
            }, {
                new: true
            });
            if (updateContact) {
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
    },
    
    unBlockContact: async (req, res, next) => {
        try {
            const updateContact = await Contact.findOneAndUpdate({
                _id: req.params.id,
                $or: [
                    {
                        creatorId: req.user._id
                    },
                    {
                        userId: req.user._id
                    },
                ],
                blockUserId: req.user._id
            }, {
                block: false
            }, {
                new: true
            });
            if (updateContact) {
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
    },

    getContact: async (req, res, next) => {
        try {
            req.user._id = '5be99326844f461870f2f4d3';
            const listContact = await Contact.find({
                $or : [
                    {
                        creatorId: req.user._id
                    },
                    {
                        userId: req.user._id
                    }
                ],
                status: 1, 
                block: false
            });
            const listUser = listContact.map(async contact => {
                const filter = {
                    $or: [
                        {
                            creatorId: contact.creatorId,
                            receiverId: contact.userId
                        },
                        {
                            creatorId: contact.userId,
                            receiverId: contact.creatorId
                        }
                    ]
                }
                let message = await Message.find(filter).sort({createdDate: -1}).limit(1)
                if (message.length == 0) {
                    message = {};
                }
                else {
                    message = message[0];
                }
                let msgUnread;
                if (req.user._id.toString() == contact.creatorId.toString()) {
                    msgUnread = await Message.count({
                        ...filter,
                        createdDate: {
                            $gte: contact.lastActiveCreator
                        }
                    })
                } else if (req.user._id.toString() == contact.userId.toString()) {
                    msgUnread = await Message.count({
                        ...filter,
                        createdDate: {
                            $gte: contact.lastActiveUser
                        }
                    })
                }
                let response = {
                    userId: contact.creatorId.toString() == req.user._id.toString()? contact.userId : contact.creatorId,
                    message: {
                        unread: msgUnread || 0,
                        lastMessage: message.desc || '',
                        lastMessageTime: message.createdDate
                    }
                };
                return response;
            })
            const result = await Promise.all(listUser);
            res.data = await popUserContact(req.dbUser, result);
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },

    getBlockList: async (req, res, next) => {
        try {
            const listContact = await Contact.find({
                $or : [
                    {
                        creatorId: req.user._id
                    }
                ],
                status: 1, 
                block: true
            });
            const listUser = listContact.map(contact => {
                let user = contact.creatorId.toString() == req.user._id.toString()? contact.userId : contact.creatorId;
                return user;
            })
            res.data = await popUserContact(req.dbUser, listUser);
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    }
}