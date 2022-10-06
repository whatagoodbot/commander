export default (options) => {
  return {
    topic: 'externalRequest',
    payload: {
      service: 'dadjoke'
    }
  }
}
