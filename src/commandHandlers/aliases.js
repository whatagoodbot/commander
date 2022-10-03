export default (options) => {
  return {
    topic: 'getAllResponses',
    payload: { 
      room: options.room
    }
  }
}
