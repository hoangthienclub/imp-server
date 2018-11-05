import mongoose, { Schema } from 'mongoose';

const roomSchema = new Schema({
	name : {type: String, default: ""},
	members : [{
		userId : {
			type : String
		},
		lastOnline : {
			type : Date,
			default : Date.now
		},
		_id : false
	}],
});
const methods = {
};

const statics = {
}
roomSchema.methods = methods;
roomSchema.statics = statics;

module.exports = mongoose.model('Room', roomSchema);
