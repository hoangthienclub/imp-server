import mongoose, { Schema } from 'mongoose';

const couponSchema = new Schema({
	hashCode: String, // QR Code

	issueedToUser: String,
	usedDate: Date,
	
	usedCompanyId: String,

	couponRootId: { type: Schema.Types.ObjectId, ref: "CouponRoot" }

});

module.exports = mongoose.model('Coupon', couponSchema);