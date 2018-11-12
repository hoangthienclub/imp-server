let popCategory = async function (schema, data) {
	let result = await schema.populate(data, [
		{
			path: "avatar",
			model: "File"
        }
    ])
	return result;
}

module.exports = {
    popCategory
}