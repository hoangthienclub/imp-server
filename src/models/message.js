import mongoose, { Schema } from 'mongoose';

const messageSchema = new Schema({
	desc : {type : String},
	file : {type : Schema.Types.ObjectId,ref : 'File'},
	status : {type : Number, default : 1}, // 1 la msg, 2 la edit, 3 la remove, 4 file
	creatorId : {type : Schema.ObjectId },
	receiverId : {type : Schema.ObjectId },
	createdDate : {type : Date, default : Date.now},
	firstMessageDay : {type : Boolean,default : false}
});

const methods = {

};

const statics = {
    loadMsgs: (filter) => {
        const ChatMessage = mongoose.model('ChatMessage');
        return ChatMessage.find(filter)
        .sort({createdDate: -1})
        .catch(err => console.log(err))
    }
}
messageSchema.methods = methods;
messageSchema.statics = statics;

module.exports = mongoose.model('Message', messageSchema);
