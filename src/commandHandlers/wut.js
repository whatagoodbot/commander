export default (options) => {
  return [{
    topic: 'broadcast',
    payload: {
      message: `You didn't hear? I'll say it louder for you... They said... ${options.lastMessage.toUpperCase()}`
    }
  }]
}
