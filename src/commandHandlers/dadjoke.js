export default (options) => {
  return {
    topic: 'externalRequest',
    payload: { 
      service: 'dadjoke',
      meta: options.meta
   }
  }
}
