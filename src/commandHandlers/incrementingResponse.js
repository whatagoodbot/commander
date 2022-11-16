
const repeater = (command, slug, userId, repeaters) => {
  if (!repeaters[slug]) {
    repeaters[slug] = {}
  }

  if (!repeaters[slug][command]) {
    repeaters[slug][command] = {
      count: 0,
      users: []
    }
  }
  const userEntry = repeaters[slug][command].users.find(user => user.id === userId)
  if (userEntry) return

  repeaters[slug][command].users.push({ id: userId, timeStamp: Date.now() })
  return repeaters[slug][command].count++
}

export default (payload, repeaters) => {
  const position = repeater(payload.command, payload.room.slug, payload.sender, repeaters)
  if (position >= 0) {
    const reply = [{
      topic: 'responseRead',
      payload: {
        category: 'system',
        key: payload.command,
        position
      }
    }]
    if (position === 2) {
      reply.push({
        topic: 'externalRequest',
        payload: {
          name: 'botVote',
          service: 'RVRB',
          arguments: undefined
        }
      })
    }
    return reply
  }
}
