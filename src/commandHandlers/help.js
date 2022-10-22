export default (options) => {
  const commandList = options.internalCommandList.concat(options.externalCommandList).sort()
  return {
    topic: 'responseRead',
    payload: {
      key: 'helpIntro',
      category: 'system',
      suffix: commandList.join(', ')
    }
  }
}
