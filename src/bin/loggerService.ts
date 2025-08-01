import logger from '../config/logger.config'

interface LogMeta {
  context?: string
  scope?: string
  requestId?: string
}

class LoggerService {
  static info(message: string, meta?: LogMeta) {
    logger.info(meta ?? {}, message)
  }

  static warn(message: string, meta?: LogMeta) {
    logger.warn(meta ?? {}, message)
  }

  static error(message: string, meta?: LogMeta) {
    logger.error(meta ?? {}, message)
  }

  static debug(message: string, meta?: LogMeta) {
    logger.debug(meta ?? {}, message)
  }

  static withScope(scope: string) {
    return {
      info: (msg: string, context?: string) =>
        logger.info({ context, scope }, msg),
      error: (msg: string, context?: string) =>
        logger.error({ context, scope }, msg),
      debug: (msg: string, context?: string) =>
        logger.debug({ context, scope }, msg),
    }
  }
}

export default LoggerService
