import {
  ExpressCaptureClass,
  expressCapture
} from '../src/express-request-capture'

/**
 * Dummy test
 */
describe('Dummy test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

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
