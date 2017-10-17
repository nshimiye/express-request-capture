import { ExpressCapture, expressCapture } from '../src/express-request-capture'

/**
 * Dummy test
 */
describe('Dummy test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('DummyClass is instantiable', () => {
    expect(new ExpressCapture()).toBeInstanceOf(ExpressCapture)
  })
  it('calls setChannel method', () => {
    let name = 'console'
    let url = undefined
    let channel = { name, url }
    expect(expressCapture.setChannel(channel)).toBeInstanceOf(ExpressCapture)
  })
  it('calls capture method', () => {
    expect(expressCapture.capture(null, null, null)).toBeDefined()
  })
})
