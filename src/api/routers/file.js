import { Router } from 'express';
import { createFile, getFile, updateFile, deleteFile, listFile } from './../controllers/file';

export default ({ config, db }) => {
	let api = Router();

	api.get('/', listFile);
	api.post('/', createFile);
    api.get('/:fileId', getFile);
    api.put('/:fileId', updateFile);
    api.delete('/:fileId', deleteFile);
    api.post('/thien/thien', (req, res, next) => {
		var key = `$2a$06$JzlsL5Ld2P8rzxhYn.aDnuXVqqzAz9.P/H.KMDKIAD7rw0ePtvpAS`;
		var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbiI6ImV5SjBlWEFpT2lKS1YxUWlMQ0poYkdjaU9pSklVekkxTmlKOS5leUp6ZFdJaU9pSTFZbVEwTVRBd01UZzVOVEUzT1RKak5qUTBOV0k0WXpZaUxDSnBZWFFpT2pFMU5ERTJNRE13TXpGOS50MUJjWXpya2lqM0JEaUdlR3VBOGI0bFVsOHQ4VnlXdmI0LWJFYnJyUzE0IiwiaWF0IjoxNTQxNjAzMDU0fQ.ckH8XgNXHPASXsMTTM1mvauNDc1zaujraFnvVNlme0E';
		var jwt = require('jsonwebtoken');
		var decoded = jwt.verify(token, key);
		console.log(decoded) // bar
	});
    
	return api;
}