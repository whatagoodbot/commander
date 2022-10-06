export default (options) => {
  const key = options.args.shift()
  const type = options.args.shift()
  const value = options.args.join(' ')

  if (options.commandList.includes(key)) {
    return {
      topic: 'responseRead',
      payload: {
        category: 'system',
        key: 'aliasConflict'
      }
    }
  }

  if (['image', 'text'].includes(type) && key && value) {
    return {
      topic: 'responseAdd',
      payload: {
        room: options.room,
        key,
        type,
        value,
        category: 'general'
      }
    }
  } else {
    return {
      topic: 'responseRead',
      payload: {
        category: 'system',
        key: 'aliasError'
      }
    }
  }
}
