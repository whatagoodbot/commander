export default (options) => {
  if (options.args) {
    const type = options.client === 'goodbot-ttl' ? options.args.shift() : 'text'
    const value = options.args.join(' ')

    if (['image', 'text'].includes(type) && value) {
      return [{
        topic: 'responseAdd',
        payload: {
          key: options.room.slug,
          type,
          value,
          category: 'roomGreeting'
        }
      }]
    } else {
      return [{
        topic: 'responseRead',
        payload: {
          category: 'system',
          key: 'addRoomGreetingError'
        }
      }]
    }
  } else {
    return [{
      topic: 'responseRead',
      payload: {
        category: 'system',
        key: 'addRoomGreetingError'
      }
    }]
  }
}
