import mongoose, { Schema } from 'mongoose';

const messageSchema = new Schema({
	companyId : {type : Schema.Types.ObjectId, ref : 'Company'},
	chatRoomId : {type : Schema.Types.ObjectId, ref : 'ChatRoom'},	
	desc : {type : String},
	file : {type : Schema.Types.ObjectId,ref : 'FileItem'},
	modifiedDate : {type : Date, default : Date.now},
	status : {type : Number, default : 1}, // 1 la msg, 2 la edit, 3 la remove, 4 file
	createdDate : {type : Date, default : Date.now},
	creatorId : {type : Schema.ObjectId, ref : 'User'},
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

export const User = mongoose.model('Message', messageSchema);
