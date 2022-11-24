import { logger, metrics } from '@whatagoodbot/utilities'

export default options => {
  const functionName = 'mock'
  logger.debug({ event: functionName })
  metrics.count(functionName)

  const message = options.lastMessage.split(' ').map((word) =>
    word
      .split('')
      .map((letter, i) =>
        i % 2 === 0 ? letter.toLowerCase() : letter.toUpperCase()
      ).join('')
  ).join(' ')
  return [{
    topic: 'broadcast',
    payload: {
      message
    }
  }]
}
