import mongoose, { Schema } from 'mongoose';

const couponSchema = new Schema({
	hashCode: String, // QR Code

	issueedToUser: String,
	usedDate: Date, //update when use
	
	usedCompanyId: String, //update when use

	couponRootId: { type: Schema.Types.ObjectId, ref: "CouponRoot" }

});

module.exports = mongoose.model('Coupon', couponSchema);