
const repeater = (command, slug, userId, repeaters) => {
  console.log('set', repeaters)
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
  const position = repeater(payload.command, payload.room, payload.sender, repeaters)
  if (position >= 0) {
    return {
      topic: 'responseRead',
      payload: {
        category: 'system',
        key: payload.command,
        room: payload.room,
        position
      }
    }
  }
}
