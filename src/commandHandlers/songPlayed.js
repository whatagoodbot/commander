import { logger, metrics } from '@whatagoodbot/utilities'
import { getExternalCommandList } from './externallyProcessed.js'

export default async (payload, repeaters) => {
  const functionName = 'resetRepeaters'
  logger.debug({ event: functionName })
  metrics.count(functionName)

  const extCommands = await getExternalCommandList(payload.room.id)
  Object.keys(extCommands).forEach(command => {
    if (repeaters[payload.room.id] && repeaters[payload.room.id][command]) {
      repeaters[payload.room.id][command].count = 0
      repeaters[payload.room.id][command].users = []
    }
  })
}
