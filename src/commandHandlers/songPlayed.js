import commands from './index.js'

export default async (payload, repeaters) => {
  Object.keys(commands).forEach(command => {
    if (repeaters[payload.room] && repeaters[payload.room][command]) {
      repeaters[payload.room][command].count = 0
      repeaters[payload.room][command].users = []
    }
  })
}
