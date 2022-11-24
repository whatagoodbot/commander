import { logger, metrics, getRandom } from '@whatagoodbot/utilities'
import { clients } from '@whatagoodbot/rpc'

export default async options => {
  const functionName = 'dice'
  logger.debug({ event: functionName })
  metrics.count(functionName)

  const input = options.args.length > 0 ? options.args.join(' ') : '1d6'

  const vals = input.split('d')
  const die = Math.abs(parseInt(vals[0] || 1, 10))
  const sides = Math.abs(parseInt(vals[1] || 6, 10))

  const total = getRandom.fromRange(die, sides * die)
  const intro = await clients.strings.get('diceIntro')
  const message = `${intro.value} ${total}`
  return [{
    topic: 'broadcast',
    payload: {
      message
    }
  }]
}
