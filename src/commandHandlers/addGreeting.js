export default (options) => {
  if (options.args) {
    const key = options.args.shift()
    const type = options.args.shift()
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
