import { version } from '../../package.json';
import { Router } from 'express';
import message from './routers/message';
import buildResponse from './../lib/buildResponse';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/message', message({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	
	buildResponse(api)
	return api;
}

