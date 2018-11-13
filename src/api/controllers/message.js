import fs from 'fs';
import Message from './../../models/message';
import { mapMessage } from './../../utils/mapping';
import { popMsg } from '../../utils/populate'; 

module.exports = {
    getMessages: async (req, res, next) => {
        try {
            let skippingMessages = req.query.total - 0 || 0;
		    let maxMessages = 20;
            const data = {
                creatorId: req.user._id,
                receiverId: req.query.receiverId,
                skippingMessages : skippingMessages,
                maxMessages: maxMessages
            }
            const messages = await Message.loadMsgs(data)
            const msgPop = await popMsg(Message, messages);
            res.data = msgPop;
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