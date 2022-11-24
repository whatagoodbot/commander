import { logger, metrics } from '@whatagoodbot/utilities'

const repeater = (command, roomId, userId, repeaters) => {
  const functionName = 'repeater'
  logger.debug({ event: functionName, command, roomId })
  metrics.count(functionName)

  if (!repeaters[roomId]) {
    repeaters[roomId] = {}
  }

  if (!repeaters[roomId][command]) {
    repeaters[roomId][command] = {
      count: 0,
      users: []
    }
  }
  const userEntry = repeaters[roomId][command].users.find(user => user.id === userId)
  if (userEntry) return

  repeaters[roomId][command].users.push({ id: userId, timeStamp: Date.now() })
  return repeaters[roomId][command].count++
}

export default (payload, repeaters) => {
  const position = repeater(payload.command, payload.room.id, payload.sender, repeaters)
  console.log(JSON.stringify(repeaters))
  if (position >= 0) {
    const replies = [{
      topic: 'responseRead',
      payload: {
        category: 'system',
        key: payload.command,
        position
      }
    }]
    if (position === 2) {
      replies.push({
        topic: 'externalRequest',
        payload: {
          command: 'botVote',
          service: 'client-rvrb',
          arguments: undefined
        }
      })
    }
    return replies
  }
}
