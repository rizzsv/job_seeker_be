// src/helpers/logRequest.helper.ts
import logger from '../utils/logger.utils'
import { LoggerService } from '../bin/logger/loggerService'
import { CustomRequest } from '../config/custom.config'

export const logRequest = async (
  req: CustomRequest,
  target: string
): Promise<void> => {
  const requestData = {
    body: req.body,
    params: req.params,
    query: req.query,
  }

  logger.info({
    user: req.user || null,
    ip: req.ip || 'unknown',
    target,
    request: requestData,
  }, `📥 Request to ${target}`)

  const serialized = JSON.stringify(requestData)

  if (req.user) {
    await LoggerService.saveLog(req.user.id, target, serialized)
  } else {
    const ip = req.ip || 'unknown'
    await LoggerService.saveExternalLog(ip, target, serialized)
  }
}
