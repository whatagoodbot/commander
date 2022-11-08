export default (options) => {
  console.log('command understood')
  return {
    topic: 'responseDelete',
    payload: {
      category: 'roomGreeting',
      key: options.room.slug
    }
  }
}
