import mongoose from 'mongoose';
import log from '../helpers/log';
require('dotenv').config()

mongoose.Promise = Promise;
const dbHost = process.env.MONGO_HOST;
const dbPort = process.env.MONGO_PORT;
const dbName = process.env.DB_NAME;
const user = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
const dbURI = process.env.MONGO_URI || `mongodb://${user}:${password}@${dbHost}:${dbPort}/${dbName}?authSource=TempNSO`;
const reconnectTimeout = process.env.RECONNECT_TIMEOUT;

function connect() {
  mongoose.connect(dbURI, { 
    autoReconnect: true,
    useNewUrlParser: true
  })
  .catch(() => {});
}

export default () => {
  const db = mongoose.connection;
  db.on('connecting', () => {
    log.dev('Connecting to MongoDB...');
  });

  db.on('error', (err) => {
    log.error(`MongoDB connection error: ${err}`);
    mongoose.disconnect();
  });

  db.on('connected', () => {
    log.dev('Connected to MongoDB!');
  });

  db.once('open', () => {
    log.dev('MongoDB connection opened!');
  });

  db.on('reconnected', () => {
    log.dev('MongoDB reconnected!');
  });

  db.on('disconnected', () => {
    log.error(`MongoDB disconnected! Reconnecting in ${reconnectTimeout / 1000}s...`);
    setTimeout(() => connect(), reconnectTimeout);
  });
  connect();
};
