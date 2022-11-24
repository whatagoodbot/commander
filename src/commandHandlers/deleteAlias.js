import { logger, metrics } from '@whatagoodbot/utilities'
import { clients } from '@whatagoodbot/rpc'
export default async options => {
  const functionName = 'deleteAlias'
  logger.debug({ event: functionName })
  metrics.count(functionName)
  if (options.args) {
    const key = options.args.shift()
    return [{
      topic: 'responseDelete',
      payload: {
        category: 'general',
        key
      }
    }]
  }
  const response = await clients.strings.get('missingArgumentDeleteAlias')
  logger.error({ event: functionName })
  return [{
    topic: 'broadcast',
    payload: {
      message: response.value
    }
  }]
}
