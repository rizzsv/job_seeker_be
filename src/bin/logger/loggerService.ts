import logger from '../../config/logger.config'

interface LogMeta {
  context?: string
  scope?: string
  requestId?: string
}

export class LoggerService {
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
  static async saveLog(userId: string, target: string, data: string) {
    // Simpan ke DB atau log file
    console.log(`Saving log for user ${userId} to ${target}`, data)
    // Contoh: await prisma.log.create(...)
  }

  static async saveExternalLog(ip: string, target: string, data: string) {
    console.log(`Saving external log from IP ${ip} to ${target}`, data)
    // Contoh: await prisma.externalLog.create(...)
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
