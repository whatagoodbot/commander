import { logger, metrics } from '@whatagoodbot/utilities'

export default () => {
  const functionName = 'getAllAliases'
  logger.debug({ event: functionName })
  metrics.count(functionName)
  return [{
    topic: 'responseReadAll',
    payload: {
      category: 'general'
    }
  }]
}
