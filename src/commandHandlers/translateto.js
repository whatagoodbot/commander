import { clients } from '@whatagoodbot/rpc'
import { logger, metrics, networking } from '@whatagoodbot/utilities'

export default async options => {
  const functionName = 'translateTo'
  logger.debug({ event: functionName })
  metrics.count(functionName)

  let q = options.lastMessage
  let target = 'en'
  if (options.args.length > 1) {
    target = options.args.shift().toLowerCase()
    q = options.args.join(' ') || options.lastMessage
  } else {
    const response = await clients.strings.get('translateToError')
    return [{
      topic: 'broadcast',
      payload: {
        message: response.value
      }
    }]
  }

  const query = {
    q,
    source: 'auto',
    target
  }
  const url = networking.buildUrl(`${process.env.HOST_TOOL_TRANSLATOR}:${process.env.PORT_TOOL_TRANSLATOR}`, ['translate'], null, 'http')
  const response = await networking.makeRequest(url, { method: 'POST', body: JSON.stringify(query) })
  let highlightStart = ''
  let highlightEnd = ''
  if (options.client.richText) {
    highlightStart = '<strong>'
    highlightEnd = '</strong>'
  }
  const message = `"${q}" in ${highlightStart}${target}${highlightEnd} is "${highlightStart}${response.translatedText}${highlightEnd}"`
  return [{
    topic: 'broadcast',
    payload: {
      message
    }
  }]
}
