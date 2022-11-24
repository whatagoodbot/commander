import { clients } from '@whatagoodbot/rpc'
import { logger, metrics } from '@whatagoodbot/utilities'
export default async options => {
  const functionName = 'lastfm'
  logger.debug({ event: functionName })
  metrics.count(functionName)
  let message = ''
  if (options?.room?.lastfm?.username) {
    const intro = await clients.strings.get('lastfmIntro')
    message = `${intro.value} https://www.last.fm/user/${options.room.lastfm.username}`
  } else {
    const intro = await clients.strings.get('noLastfm')
    message = intro.value
  }
  return [{
    topic: 'broadcast',
    payload: {
      message
    }
  }]
}
