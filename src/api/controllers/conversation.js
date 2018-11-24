import fs from 'fs';
import Contact from './../../models/contact';
import Message from './../../models/message';
import { mapMessage } from './../../utils/mapping';
import { create, find, findById, update, deleteFn } from '../../utils/handle';
import { popContact, popUserConversation } from '../../utils/popDbUser'; 

module.exports = {
    getConversation: async (req, res, next) => {
        try {
            const users = await req.dbUser.collection('users').find().toArray()
            const listUser = users.map(user => {
                let response = {
                    ...user,
                    message: {
                        unread: 0,
                        lastMessage: '',
                        lastMessageTime: new Date()
                    }
                };
                return response;
            })
            const listUserconver = listUser.filter(user => user._id.toString() != req.user._id);
            res.data = listUserconver;
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    }
}

// getConversation: async (req, res, next) => {
//     try {
//         const listContact = await Contact.find({
//             $or : [
//                 {
//                     creatorId: req.user._id
//                 },
//                 {
//                     userId: req.user._id
//                 }
//             ],
//             status: 1, 
//             block: false
//         });
//         const listUser = listContact.map(async contact => {
//             const filter = {
//                 $or: [
//                     {
//                         creatorId: contact.creatorId,
//                         receiverId: contact.userId
//                     },
//                     {
//                         creatorId: contact.userId,
//                         receiverId: contact.creatorId
//                     }
//                 ]
//             }
//             let message = await Message.find(filter).sort({createdDate: -1}).limit(1)
//             if (message.length == 0) {
//                 message = {};
//             }
//             else {
//                 message = message[0];
//             }
//             let msgUnread;
//             if (req.user._id.toString() == contact.creatorId.toString()) {
//                 msgUnread = await Message.count({
//                     ...filter,
//                     createdDate: {
//                         $gte: contact.lastActiveCreator
//                     }
//                 })
//             } else if (req.user._id.toString() == contact.userId.toString()) {
//                 msgUnread = await Message.count({
//                     ...filter,
//                     createdDate: {
//                         $gte: contact.lastActiveUser
//                     }
//                 })
//             }
//             let response = {
//                 userId: contact.creatorId.toString() == req.user._id.toString()? contact.userId : contact.creatorId,
//                 message: {
//                     unread: msgUnread || 0,
//                     lastMessage: message.desc || '',
//                     lastMessageTime: message.createdDate
//                 }
//             };
//             return response;
//         })
//         const result = await Promise.all(listUser);
//         res.data = await popUserConversation(req.dbUser, result);
//         next();
//     }
//     catch (err) {
//         console.log(err)
//         next(err);
//     }
// }