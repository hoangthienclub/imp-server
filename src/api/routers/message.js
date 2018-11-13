import { Router } from 'express';
import { getMessages, getFiles } from './../controllers/message';
import { popMsgUser } from '../../utils/popDbUser'; 

export default ({ config, dbUser }) => {
	let api = Router();

	api.get('/', getMessages);
	api.get('/files', getFiles);
	
	api.all('*', async (req, res, next) => {
		const data = await popMsgUser(dbUser, res.data)
		res.data = data;
		next();
	})
	return api;
}
