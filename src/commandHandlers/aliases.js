export default (options) => {
  return {
    topic: 'responseReadAll',
    payload: {
      category: 'general',
      room: options.room
    }
  }
}
