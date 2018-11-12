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

module.exports = {
	popCategory,
	popProduct
}