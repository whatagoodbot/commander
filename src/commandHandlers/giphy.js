export default (options) => {
  return {
    topic: 'externalRequest',
    payload: { 
      service: 'giphy',
      query: {
        search: options.args.join(' ')
      },
      meta: options.meta
    }
  }
}
