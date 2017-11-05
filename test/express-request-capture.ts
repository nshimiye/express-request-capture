import {
  ExpressCaptureClass,
  expressCapture,
  capture
} from '../src/express-request-capture'

/**
 * Dummy test
 */
describe('Dummy test', () => {
  it('DummyClass is instantiable', () => {
    expect(new ExpressCaptureClass()).toBeInstanceOf(ExpressCaptureClass)
  })
  it('calls setChannel method', () => {
    let name = 'console'
    let url = undefined
    let channel = { name, url }
    expect(expressCapture.setChannel(channel)).toBeInstanceOf(
      ExpressCaptureClass
    )
  })
  it('calls capture method', () => {
    expect(expressCapture.capture(null, null, null)).toBeDefined()
  })
})
describe('Middleware', () => {
  it('creates a middleware function', () => {
    expect(capture()).toBeInstanceOf(Function)
  })
  it('calls next after logging the request', () => {
    expect(
      capture()(null, null, () => {
        return (req, res, next) => {
          return true
        }
      })
    ).toBeInstanceOf(Function)
  })
})
