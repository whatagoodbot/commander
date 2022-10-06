export default (options) => {
  return {
    topic: 'externalRequest',
    payload: {
      service: 'weather',
      query: {
        search: options.args.join(' ')
      }
    }
  }
}
