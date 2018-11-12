import mongoose, { Schema } from 'mongoose';

const fileSchema = new Schema({
	createdDate : {type : Date, default : Date.now},
	size : {type : Number, default : 0},
	name : {type : String},
	pathName: {type: String},
	status : {type : Number, enum : [0, 1], default : 0},
	type: String,
	active: {type: Boolean, default: true}
});

module.exports = mongoose.model('File', fileSchema);