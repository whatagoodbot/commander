import alias from './alias.js'
import aliases from './aliases.js'
import dadjoke from './dadjoke.js'
import giphy from './giphy.js'
import weather from './weather.js'
import help from './help.js'
import addgreeting from './addGreeting.js'
import repeatingCommands from '../repeatingCommands.js'
import incrementingResponse from './incrementingResponse.js'

const commandList = {
  alias,
  aliases,
  dadjoke,
  giphy,
  weather,
  help,
  addgreeting
}

repeatingCommands.forEach(command => {
  commandList[command] = incrementingResponse
})

export default commandList
