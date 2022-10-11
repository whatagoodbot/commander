export default (options) => {
  const commandList = options.internalCommandList.concat(options.externalCommandList)
  return {
    topic: 'responseRead',
    payload: {
      key: 'helpIntro',
      category: 'system',
      suffix: commandList.join(', '),
      meta: options.meta
    }
  }
}
