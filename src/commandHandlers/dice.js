function getRandomIntInclusive (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default (options) => {
  const input = options.args.length > 0 ? options.args.join(' ') : '1d6'

  const vals = input.split('d')
  const die = Math.abs(parseInt(vals[0] || 1, 10))
  const sides = Math.abs(parseInt(vals[1] || 6, 10))

  const total = getRandomIntInclusive(die, sides * die)
  const message = 'You rolled: ' + total

  return {
    topic: 'broadcast',
    payload: {
      message
    }
  }
}
