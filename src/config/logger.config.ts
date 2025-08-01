import pino from 'pino'

// Cek environment
const isProd = process.env.NODE_ENV === 'production'

let logger = pino({
  level: isProd ? 'info' : 'debug',
  base: null,
  timestamp: pino.stdTimeFunctions.isoTime,
})

if (!isProd) {
  const transport = pino.transport({
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
      messageFormat: (
        log: Record<string, unknown>,
        messageKey: string,
        levelLabel: string
      ) => {
        let msg = `{${levelLabel}} ${log[messageKey]}`
        if (log.context) msg += ` | context: ${log.context}`
        if (log.scope) msg += ` | scope: ${log.scope}`
        if (log.requestId) msg += ` | reqId: ${log.requestId}`
        return msg
      },
    } as any, // 👈 cast ke 'any' agar lolos pengecekan TypeScript
  })

  logger = pino(
    {
      level: 'debug',
      base: null,
      timestamp: pino.stdTimeFunctions.isoTime,
    },
    transport
  )
}

export default logger
