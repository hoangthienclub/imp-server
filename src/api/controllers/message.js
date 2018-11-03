import fs from 'fs';
import Message from './../../models/message';
import { mapMessage } from './../../utils/mapping';

module.exports = {
    getMessages: async (req, res, next) => {
        try {
            const data = {
                creatorId: 1,
                receiverId: 2,
                // skippingMessages : 10,
                // maxMessages: 10
            }
            const messages = await Message.loadMsgs(data)
            res.data = messages.map(mapMessage);
            next();
        }
        catch (err) {
            console.log(err);
        }
    },

    getFiles: async (req, res, next) => {
        try {
            const data = {
                creatorId: 1,
                receiverId: 2,
                // skippingMessages : 10,
                // maxMessages: 10
            }
            const messages = await Message.loadFiles(data)
            res.data = messages.map(mapMessage);
            next();
        }
        catch (err) {
            console.log(err);
        }
    }
}