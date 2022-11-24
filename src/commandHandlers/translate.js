import { logger, metrics, networking } from '@whatagoodbot/utilities'

export default async options => {
  const functionName = 'translate'
  logger.debug({ event: functionName })
  metrics.count(functionName)

  let q = options.lastMessage
  const target = 'en'
  if (options.args) {
    q = options.args.join(' ') || options.lastMessage
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
