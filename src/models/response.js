import mongoose, { Schema } from 'mongoose';

const responseSchema = new Schema({
    creatorId: { type: Schema.Types.ObjectId },
    desc: { type: String, default: ''},
	active: {type: Boolean, default: true}
}, { timestamps: true });
const methods = {
};

const statics = {
}
responseSchema.methods = methods;
responseSchema.statics = statics;

module.exports = mongoose.model('Response', responseSchema);
