import mongoose, { Schema } from 'mongoose';

const messageSchema = new Schema({
	desc : {type : String},
	fileId : {type : Schema.Types.ObjectId,ref : 'File'},
	status : {type : Number, default : 1}, // 1 la msg, 2 la edit, 3 la remove, 4 file
	creatorId : String,
	receiverId : String,
	createdDate : {type : Date, default : Date.now},
	firstMessageDay : {type : Boolean,default : false}
});

const methods = {

};

const statics = {
    loadMsgs: (data) => {
		const Message = mongoose.model('Message');
		let filter = {
			$or: [
				{
					creatorId: data.creatorId, 
					receiverId: data.receiverId
				},
				{
					creatorId: data.receiverId, 
					receiverId: data.creatorId
				}
			]
		}
        return Message.find(filter)
		.sort({createdDate: -1})
		.skip(data.skippingMessages || 0)
		.limit(data.maxMessages || 0)
        .catch(err => console.log(err))
    }
}
messageSchema.methods = methods;
messageSchema.statics = statics;

module.exports = mongoose.model('Message', messageSchema);
