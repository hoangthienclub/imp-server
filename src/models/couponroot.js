import mongoose, { Schema } from 'mongoose';

const couponSchema = new Schema({
	companyId: String,
	name: String,
	desc: String,

	banner: [{
		type : Schema.Types.ObjectId,ref : 'File'
	}],

	type: Number, // 1 for Percent, 2 for Number
	value: Number, // Value of Discount
	productCategory: [{
		type: Schema.Types.ObjectId, ref: "Product"
	}],

	createdDate : {type : Date, default : Date.now},
	creatorId: String,

	hashCode: String, // QR Code
	validFrom: Date,
	validTo: Date,
});

module.exports = mongoose.model('CouponRoot', couponSchema);