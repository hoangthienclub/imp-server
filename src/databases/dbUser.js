import { MongoClient } from 'mongodb';
var connectDBUser = async () =>  {
	try {
		var client = await MongoClient.connect(`${process.env.MONGO_USER_URI}/${process.env.MONGO_ADMIN_DB}`);
		const db = client.db(process.env.MONGO_USER_DB);
		return db;
	}
	catch (err) {
		return err;
	}
}

module.exports = connectDBUser;