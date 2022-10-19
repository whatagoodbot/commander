export default (options) => {
  if (options.args) {
    const type = options.args.shift()
    const value = options.args.join(' ')

    if (['image', 'text'].includes(type) && value) {
      return {
        topic: 'responseAdd',
        payload: {
          room: options.room,
          key: options.room,
          type,
          value,
          category: 'roomGreeting'
        }
      }
    } else {
      return {
        topic: 'responseRead',
        payload: {
          category: 'system',
          key: 'addRoomGreetingError'
        }
      }
    }
  } else {
    return {
      topic: 'responseRead',
      payload: {
        category: 'system',
        key: 'addRoomGreetingError'
      }
    }
  }
}
