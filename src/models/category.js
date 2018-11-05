import mongoose, { Schema } from 'mongoose';

const categorySchema = new Schema({
	name: String,
	desc: String,
	avatar: {type : Schema.Types.ObjectId, ref : 'File'}
});

module.exports = mongoose.model('Category', categorySchema);