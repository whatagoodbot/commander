export default (knex) => {
  return {
    get: async (room) => {
      return await knex('commands')
        .where(queryBuilder => {
          if (room) {
            queryBuilder.andWhere('room', room).orWhereNull('room')
          } else {
            queryBuilder.whereNull('room')
          }
        })
    }
  }
}
