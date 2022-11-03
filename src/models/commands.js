export default (knex) => {
  return {
    get: async (room) => {
      return await knex('commands')
        .where({ room })
        .orWhereNull('room')
    }
  }
}
