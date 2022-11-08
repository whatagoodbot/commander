export default (options) => {
  if (options.args) {
    const key = options.args.shift().replace(/@/g, '')
    const type = options.client === 'goodbot-ttl' ? options.args.shift() : 'text'
    const value = options.args.join(' ')
    if (['image', 'text'].includes(type) && key && value) {
      return {
        topic: 'responseAdd',
        payload: {
          key,
          type,
          value,
          category: 'userGreeting'
        }
      }
    } else {
      return {
        topic: 'responseRead',
        payload: {
          category: 'system',
          key: 'addGreetingError'
        }
      }
    }
  } else {
    return {
      topic: 'responseRead',
      payload: {
        category: 'system',
        key: 'addGreetingError'
      }
    }
  }
}
