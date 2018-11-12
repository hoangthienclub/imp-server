import mongoose, { Schema } from 'mongoose';

const couponSchema = new Schema({
	hashCode: { type: String, required: true }, // QR Code
	issueedDate: { type: Date, default: Date.now },
	issueedToUser: { type: String, required: true },
	acceptedUser: String,
	usedDate: Date, //update when use
	usedCompanyId: String, //update when use
	couponRootId: { type: Schema.Types.ObjectId, ref: "CouponRoot", required: true },
	active: {type: Boolean, default: true}
});

module.exports = mongoose.model('Coupon', couponSchema);