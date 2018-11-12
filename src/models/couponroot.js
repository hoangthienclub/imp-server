import mongoose, { Schema } from 'mongoose';

const couponSchema = new Schema({
	companyId: { type: String },
	name: { type: String, required: true },
	desc: { type: String, required: true },

	banner: [{
		type : Schema.Types.ObjectId,ref : 'File'
	}],

	type: { type: Number, required: true }, // 1 for Percent, 2 for Number
	value: { type: Number, required: true }, // Value of Discount
	productCategory: [{
		type: Schema.Types.ObjectId, ref: "Product"
	}],

	createdDate : {type : Date, default : Date.now},
	creatorId: { type: Schema.Types.ObjectId },

	hashCode: { type: String, required: true }, // QR Code
	validFrom: { type: Date, required: true },
	validTo: { type: Date, required: true },
	active: {type: Boolean, default: true}
});

module.exports = mongoose.model('CouponRoot', couponSchema);