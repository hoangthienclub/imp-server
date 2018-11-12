import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
	companyId: String,

	name: String,
	desc: String,
	price: String,
	
	image: [{
		type : Schema.Types.ObjectId, ref : 'File'
	}],

	category: [{
		type : Schema.Types.ObjectId, ref : 'Category'
	}],
	active: {type: Boolean, default: true}
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);