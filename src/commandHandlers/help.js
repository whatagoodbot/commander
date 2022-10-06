export default (options) => {
  return {
    topic: 'responseRead',
    payload: {
      key: 'helpIntro',
      category: 'system',
      suffix: options.commandList.join(', '),
      meta: options.meta
    }
  }
}
