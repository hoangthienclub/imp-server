import mongoose, { Schema } from 'mongoose';

const messageSchema = new Schema({
	desc : {type : String},
	fileId : {type : Schema.Types.ObjectId,ref : 'File'},
	status : {type : Number, default : 1}, // 1 la msg, 2 la edit, 3 la remove, 4 file
	creatorId : { type: Schema.Types.ObjectId },
	receiverId : { type: Schema.Types.ObjectId },
	createdDate : {type : Date, default : Date.now},
	firstMessageDay : {type : Boolean,default : false},
	active: {type: Boolean, default: true}
}, { timestamps: true });

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
			],
			createdDate: { $lte: data.time }
		}
		console.log(filter)
        return Message.find(filter)
		.sort({createdDate: -1})
		// .skip(data.skippingMessages || 0)
		.limit(data.maxMessages || 0)
        .catch(err => console.log(err))
	},
	loadFiles: (data) => {
		const Message = mongoose.model('Message');
		const filter = {
			$or: [
				{
					creatorId: data.creatorId, 
					receiverId: data.receiverId,
					fileId: { $exists: true }
				},
				{
					creatorId: data.receiverId, 
					receiverId: data.creatorId,
					fileId: { $exists: true }
				}
			]
		}
		return Message.find(filter)
	}
}
messageSchema.methods = methods;
messageSchema.statics = statics;

module.exports = mongoose.model('Message', messageSchema);
