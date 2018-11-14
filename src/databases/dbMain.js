import { MongoClient } from 'mongodb';
var connectDBMain = async () =>  {
	try {
		var client = await MongoClient.connect(`${process.env.MONGO_USER_URI}/${process.env.MONGO_USER_DB}`);
		const db = client.db(process.env.MONGO_MAIN_DB);
		return db;
	}
	catch (err) {
		return err;
	}
}

module.exports = connectDBMain;