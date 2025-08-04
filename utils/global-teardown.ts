import { FullConfig } from '@playwright/test';
import { Logger } from './logger';

async function globalTeardown(config: FullConfig) {
  const logger = new Logger('GlobalTeardown');
  
  logger.info('Starting global test teardown');
  
  // Perform any global cleanup tasks here
  // e.g., stop test servers, cleanup databases, etc.
  
  logger.info('Global teardown completed');
}

export default globalTeardown;