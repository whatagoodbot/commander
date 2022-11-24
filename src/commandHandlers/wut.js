import { logger, metrics } from '@whatagoodbot/utilities'
import { clients } from '@whatagoodbot/rpc'

export default async options => {
  const functionName = 'wut'
  logger.debug({ event: functionName })
  metrics.count(functionName)

  const intro = await clients.strings.get('wutIntro')
  let highlightStart = ''
  let highlightEnd = ''
  if (options.client.richText) {
    highlightStart = '<strong>'
    highlightEnd = '</strong>'
  }
  return [{
    topic: 'broadcast',
    payload: {
      message: `${intro.value} ${highlightStart}${options.lastMessage.toUpperCase()}${highlightEnd}`
    }
  }]
}
