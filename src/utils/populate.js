let popCategory = async function (schema, data) {
	let result = await schema.populate(data, [
		{
			path: "avatar",
			model: "File"
        }
    ])
	return result;
}

let popProduct = async function (schema, data) {
	let result = await schema.populate(data, [
		{
			path: "image",
			model: "File"
        }, {
			path: "category",
			model: "Category"
		}
    ])
	return result;
}

let popCouponRoot = async function (schema, data) {
	let result = await schema.populate(data, [
		{
			path: "banner",
			model: "File"
        }, {
			path: "productCategory",
			model: "Product"
		}
    ])
	return result;
}

module.exports = {
	popCategory,
	popProduct,
	popCouponRoot
}