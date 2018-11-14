import mongoose, { Schema } from 'mongoose';

const categorySchema = new Schema({
	name: String,
	desc: String,
	avatar: {type : Schema.Types.ObjectId, ref : 'File'},
	active: {type: Boolean, default: true}
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);