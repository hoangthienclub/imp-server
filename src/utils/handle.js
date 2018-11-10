let find = async function (schema, filter, sort = "-createdAt", limit = { start: 0, end: 10 }) {
	try {
		let result = await schema.find(filter).sort(sort).limit(limit.end - limit.start).skip(limit.start).exec();
		return result;
	}
	catch (err) {
		throw(err.message || 'An error occurred while processing your request, we are actively addressing the issue.')
	}
}

let findById = async function (schema, _id, filter) {
	try {
		let search = { _id }
		if (filter) {
			search = Object.assign({}, search, filter);
		}
		let result = await schema.find(search).exec();
		return result.length ? result[0] : {};
	}
	catch (err) {
		throw(err.message || 'An error occurred while processing your request, we are actively addressing the issue.')
	}
}

let update = async function (schema, data) {
	try {
		let result = await schema.findOneAndUpdate({ _id: data._id }, { $set: data }, { new: true, runValidators: true }).exec();
		return result;
	}
	catch (err) {
		throw(err.message || 'An error occurred while processing your request, we are actively addressing the issue.')
	}
}

let deleteFn = async function (schema, _id) {
	try {
		let result = await schema.findOneAndUpdate({ _id }, { $set: { active: false } }, { new: true }).exec();
		return result;
	}
	catch (err) {
		throw(err.message || 'An error occurred while processing your request, we are actively addressing the issue.')
	}
}

let create = async function (schema, data) {
	try {
		const dataNew = new schema(data);
		const dataCreate = await dataNew.save();
		return dataCreate;
	}
	catch (err) {
		throw(err.message || 'An error occurred while processing your request, we are actively addressing the issue.')
	}
}

module.exports = {
	find,
	findById,
	update,
	deleteFn,
	create
}