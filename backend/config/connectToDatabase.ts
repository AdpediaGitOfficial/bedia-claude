import mongoose from 'mongoose';
import logger from './logger';
import configKeys from '../configKeys';

const DB_URI: string = configKeys.DATABASE_URL;
const MAX_RETRY_ATTEMPTS = 20;
const RETRY_INTERVAL = 3000;

let retryCount = 0;

function connectToDatabase() {
  mongoose.set('strictQuery', false);

  function connect() {
    mongoose
      .connect(DB_URI)
      .then(() => {
        const dbName = mongoose.connection.db?.databaseName || 'unknown';
        logger.info(`✅ Database connected to ${dbName}`);
        retryCount = 0;
        // const dbName = mongoose.connection.db.databaseName;
        // logger.info(`Database connected to ${dbName}`);
        // retryCount = 0; // Reset retry count on successful connection
      })
      .catch((err: Error) => {
        logger.error('Failed to connect to database:', err);
        if (retryCount < MAX_RETRY_ATTEMPTS) {
          logger.info(`Retrying connection... Attempt ${retryCount + 1}/${MAX_RETRY_ATTEMPTS}`);
          retryCount++;
          setTimeout(connect, RETRY_INTERVAL);
        } else {
          logger.error(
            `Unable to connect after ${MAX_RETRY_ATTEMPTS} attempts. Stopping the application.`,
          );
          process.exit(1);
        }
      });
  }
  connect(); // Initial connection attempt
}

export default connectToDatabase;
