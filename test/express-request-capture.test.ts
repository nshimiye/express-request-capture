import { ExpressCapture, hello, capture } from '../src/express-request-capture'

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
  it('calls me method', () => {
    let name = 'mars'
    let expected = `Hello ${name}`
    expect(hello(name)).toEqual(expected)
  })
  it('calls capture method', () => {
    expect(capture(null, null, null)).toBeDefined()
  })
})
