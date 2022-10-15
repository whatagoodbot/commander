export default (knex) => {
  return {
    get: async (slug) => {
      let generalBotConfig = await knex('config')
        .where({ name: 'whatAGoodBot' })
        .first()
      let roomBotConfig = await knex('rooms')
        .where({ slug })
        .first()
      if (generalBotConfig?.config) {
        generalBotConfig = JSON.parse(generalBotConfig.config)
        if (roomBotConfig?.botConfig) roomBotConfig = JSON.parse(roomBotConfig.botConfig)
        const botConfig = {
          ...generalBotConfig,
          ...roomBotConfig
        }
        return botConfig
      }
      // if (result?.config) return JSON.parse(result.config)
    }
  }
}
