export default (knex) => {
  return {
    get: async (slug) => {
      return await knex('commands')
    }
  }
}
