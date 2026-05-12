import mongoose from 'mongoose';
import config from '../config';
import { seedSuperAdmin } from './seedAdmin';
import { logger, errorLogger } from '../shared/logger';

let isConnected = false;

export const dbConnect = async () => {
  mongoose.set('strictQuery', true);

  if (isConnected) {
    logger.info('MongoDB is already connected');
    return;
  }

  try {
    await mongoose.connect(config.database_url as string);
    isConnected = true;
    logger.info('🚀 Database connected successfully');
    await seedSuperAdmin();
  } catch (error) {
    errorLogger.error('🤢 Failed to connect Database', error);
  }
};
