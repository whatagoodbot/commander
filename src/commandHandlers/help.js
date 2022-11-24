import { clients } from '@whatagoodbot/rpc'
import { logger, metrics } from '@whatagoodbot/utilities'

export default async options => {
  const functionName = 'help'
  logger.debug({ event: functionName })
  metrics.count(functionName)

  const commandList = options.internalCommandList.concat(options.externalCommandList).sort()
  const intro = await clients.strings.get('helpIntro')
  return [{
    topic: 'broadcast',
    payload: {
      message: `${intro.value} ${commandList.join(', ')}`
    }
  }]
}
