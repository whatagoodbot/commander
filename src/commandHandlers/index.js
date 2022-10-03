import { configDb } from '../models/index.js'

import aliases from './aliases.js'
import dadjoke from './dadjoke.js'
import giphy from './giphy.js'
import weather from './weather.js'

const botConfig = await configDb.get('whatAGoodBot')

const commands = {
  aliases,
  dadjoke,
  giphy,
  weather,
  // addgreeting: async (options) => {
  //   options.type = 'text'
  //   return await addGreeting(options)
  // },
  // addgreetingimage: async (options) => {
  //   options.type = 'image'
  //   return await addGreeting(options)
  // },
  // alias: async (options) => {
  //   options.commands = getcommands()
  //   return await addResponse(options)
  // },
  // help: async (options) => {
  //   return { message: `${await stringsDb.get('helpIdentifier')} ${options.botConfig.commandIdentifier}. ${await stringsDb.get('helpCommands')} ${getcommands().join(', ')}` }
  // },
  // leaderboard: async (options) => {
  //   return await playReactionsDb.getReactionTable(options)
  // },
  // mydopes: async (options) => {
  //   options.type = 'dope'
  //   return await playReactionsDb.getUserReactions(options)
  // },
  // mynopes: async (options) => {
  //   options.type = 'nope'
  //   return await playReactionsDb.getUserReactions(options)
  // },
  // mystars: async (options) => {
  //   options.type = 'star'
  //   return await playReactionsDb.getUserReactions(options)
  // },
  // myspins: async (options) => {
  //   options.getPlaysForKey = 'user'
  //   options.getPlaysForValue = options.sender
  //   return await userPlaysDb.getPlays(options)
  // },
  // mystats: async (options) => {
  //   options.getPlaysForKey = 'user'
  //   options.getPlaysForValue = options.sender
  //   const promises = [
  //     userPlaysDb.getPlays(options),
  //     playReactionsDb.getUserReactions({ type: 'dope', ...options }),
  //     playReactionsDb.getUserReactions({ type: 'nope', ...options }),
  //     playReactionsDb.getUserReactions({ type: 'star', ...options })
  //   ]
  //   const reply = await Promise.all(promises)
  //     .then((returnedPromises) => {
  //       return returnedPromises.map((returnedPromise) => {
  //         return returnedPromise.message
  //       })
  //     })
  //   return { messages: reply }
  // },
  // relink,
  // ro,
  // roomdopes: async (options) => {
  //   options.type = 'dope'
  //   return await playReactionsDb.getRoomReactions(options)
  // },
  // roomfavourite: async (options) => {
  //   return await playReactionsDb.getRoomFavourite(options)
  // },
  // roomnopes: async (options) => {
  //   options.type = 'nope'
  //   return await playReactionsDb.getRoomReactions(options)
  // },
  // roomstars: async (options) => {
  //   options.type = 'star'
  //   return await playReactionsDb.getRoomReactions(options)
  // },
  // roomspins: async (options) => {
  //   options.getPlaysForKey = 'room'
  //   options.getPlaysForValue = options.roomProfile.slug
  //   return await userPlaysDb.getPlays(options)
  // },
  // roomstats: async (options) => {
  //   options.getPlaysForKey = 'room'
  //   options.getPlaysForValue = options.roomProfile.slug
  //   const promises = [
  //     userPlaysDb.getPlays(options),
  //     playReactionsDb.getRoomReactions({ type: 'dope', ...options }),
  //     playReactionsDb.getRoomReactions({ type: 'nope', ...options }),
  //     playReactionsDb.getRoomReactions({ type: 'star', ...options })
  //   ]
  //   const reply = await Promise.all(promises)
  //     .then((returnedPromises) => {
  //       return returnedPromises.map((returnedPromise) => {
  //         return returnedPromise.message
  //       })
  //     })
  //   return { messages: reply }
  // },
  // qt,
  // yt: (options => {
  //   options.client.publish(`${options.topicPrefix}externalRequest`, JSON.stringify({ 
  //     service: 'youtube',
  //     query: {
  //       search: options.args.join(' ')
  //     },
  //     meta: options.meta
  //  }))
  // }),
  // up,
  // down
}

const getcommands = () => { return Object.keys(commands) }

const processArguments = (message, separatorPosition) => {
  let args
  if (separatorPosition > 0) {
    args = message?.substring(separatorPosition + 1)
  }
  if (args) args = args.split(' ')
  return args
}

const processCommand = (command, args, options) => {
  commands[command]({ args, ...options })
}

export const searchForCommand = (options) => {
  if (botConfig.commandIdentifiers.includes(options.message?.substring(0, 1))) {
    const separatorPosition = options.message.indexOf(' ') > 0 ? options.message.indexOf(' ') : options.message.length
    const command = options.message?.substring(1, separatorPosition)

    if (getcommands().includes(command)) {
      const commandActions = processCommand(command, processArguments(options.message, separatorPosition), options)

      client.publish(`${options.topicPrefix}${commandActions.topic}`, JSON.stringify(commandActions.payload))
      
    } else {
      // If it's not a command, it will either be a standardmessage or an alias - both of which are handled by responder
      
    }
  }
}
