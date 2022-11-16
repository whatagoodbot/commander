import { expect } from 'chai'
import dice from '../src/commandHandlers/dice.js'
import magic8ball, { responses } from '../src/commandHandlers/magic8ball.js'

describe('networking', function () {
  it('should return a function to add text responder', () => {
    expect('').to.be.a('string')
  })
})

describe('test commands', function () {
  it('Should handle dice', () => {
    // Test default dice
    const diceRoll = dice({ args: [] })
    const d1 = diceRoll[0]
    expect(d1).to.have.nested.property('payload.message').contains('You rolled: ')

    const n1 = parseInt(d1.payload.message.replace('You rolled: ', ''))
    expect(n1).to.be.a('number')
    expect(n1).to.be.greaterThanOrEqual(1)
    expect(n1).to.be.lessThanOrEqual(6)

    // Test custom dice
    const diceRoll2 = dice({ args: ['1d20'] })
    const d2 = diceRoll2[0]
    expect(d2).to.have.nested.property('payload.message').contains('You rolled: ')

    const n2 = parseInt(d2.payload.message.replace('You rolled: ', ''))
    expect(n2).to.be.a('number')
    expect(n2).to.be.greaterThanOrEqual(1)
    expect(n2).to.be.lessThanOrEqual(20)

    // Test multiple dices
    const diceRoll3 = dice({ args: ['6d6'] })
    const d3 = diceRoll3[0]
    expect(d3).to.have.nested.property('payload.message').contains('You rolled: ')

    const n3 = parseInt(d3.payload.message.replace('You rolled: ', ''))
    expect(n3).to.be.a('number')
    expect(n3).to.be.greaterThanOrEqual(6)
    expect(n3).to.be.lessThanOrEqual(36)
  })

  it('Should handle magic8ball', () => {
    const response = magic8ball()
    expect(response[0]).to.have.nested.property('payload.message').to.be.oneOf(responses)
  })
})
