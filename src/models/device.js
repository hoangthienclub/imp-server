import mongoose, { Schema } from 'mongoose';

const deviceSchema = new Schema({
    userId: { type: Schema.Types.ObjectId },
    token: { type: String, required: true },
    deviceId: { type: String, required: true },
	active: {type: Boolean, default: true}
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);