import databases from './databases';
import Session from 'express-session';

export default callback => {
	// connect to a database if needed, then pass it to `callback`:
	databases.mongodb();
	databases.redis(Session);
	callback();
}
