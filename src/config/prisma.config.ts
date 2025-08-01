import { PrismaClient } from '@prisma/client';
import logger from './logger.config';
import { PrismaQueryEvent, PrismaLogEvent } from '../utils/prisma-events';

export const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'info', emit: 'event' },
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' },
  ],
});

prisma.$on('query', (event: PrismaQueryEvent) => {
  const cleanedQuery = event.query.replace(/\s+/g, ' ').trim();
  logger.debug({
    context: 'PrismaClient',
    scope: 'Query',
    requestId: event.target,
    query: cleanedQuery,
    params: event.params,
    duration: `${event.duration}ms`,
  }, `💡 Executed Query`);
});

prisma.$on('info', (event: PrismaLogEvent) => {
  logger.info({
    context: 'PrismaClient',
    scope: 'Info',
    message: event.message,
  }, 'ℹ️ Prisma Info');
});

prisma.$on('warn', (event: PrismaLogEvent) => {
  logger.warn({
    context: 'PrismaClient',
    scope: 'Warning',
    message: event.message,
  }, '⚠️ Prisma Warning');
});

prisma.$on('error', (event: PrismaLogEvent) => {
  logger.error({
    context: 'PrismaClient',
    scope: 'Error',
    message: event.message,
  }, '❌ Prisma Error');
});

export default prisma;
