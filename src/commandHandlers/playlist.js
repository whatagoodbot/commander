import { clients } from '@whatagoodbot/rpc'
import { logger, metrics } from '@whatagoodbot/utilities'
export default async options => {
  const functionName = 'playlist'
  logger.debug({ event: functionName })
  metrics.count(functionName)
  let message = ''
  if (options?.room?.spotify?.starredPlaylist) {
    const intro = await clients.strings.get('playlistIntro')
    message = `${intro.value} https://open.spotify.com/playlist/${options.room.spotify.starredPlaylist}`
  } else {
    const intro = await clients.strings.get('noPlaylist')
    message = intro.value
  }
  return [{
    topic: 'broadcast',
    payload: {
      message
    }
  }]
}
