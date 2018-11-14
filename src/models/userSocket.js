import mongoose, { Schema } from 'mongoose';

const userSocketSchema = new Schema({
	userId : { type : Schema.Types.ObjectId, required: true },
	socketId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('UserSocket', userSocketSchema);
