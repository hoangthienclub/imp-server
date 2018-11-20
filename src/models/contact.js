import mongoose, { Schema } from 'mongoose';

const contactSchema = new Schema({
    creatorId: { type: Schema.Types.ObjectId },
    userId: { type: Schema.Types.ObjectId },
    status: {
        type: Number,
        default: 0 //0 request, 1 accept
    },
	active: {type: Boolean, default: true}
}, { timestamps: true });
const methods = {
};

const statics = {
}
contactSchema.methods = methods;
contactSchema.statics = statics;

module.exports = mongoose.model('Contact', contactSchema);
