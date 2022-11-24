import { clients } from '@whatagoodbot/rpc'
import { logger, metrics } from '@whatagoodbot/utilities'

export default async options => {
  const functionName = 'alias'
  logger.debug({ event: functionName })
  metrics.count(functionName)

  if (options.args) {
    const key = options.args.shift()
    const value = options.args.join(' ')
    if (key && value) {
      if (options.internalCommandList.includes(key) || options.externalCommandList.includes(key)) {
        const response = await clients.strings.get('aliasConflict')
        logger.debug({ event: functionName, method: 'aliasConflict', key })
        return [{
          topic: 'broadcast',
          payload: {
            message: response.value
          }
        }]
      }

      logger.debug({ event: functionName })
      metrics.count(functionName)
      return [{
        topic: 'responseAdd',
        payload: {
          key,
          value,
          category: 'general'
        }
      }]
    }
  }
  const response = await clients.strings.get('aliasError')
  logger.error({ event: functionName })
  return [{
    topic: 'broadcast',
    payload: {
      message: response.value
    }
  }]
}
