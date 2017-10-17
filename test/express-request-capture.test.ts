import DummyClass from '../src/express-request-capture'

/**
 * Dummy test
 */
describe('Dummy test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('DummyClass is instantiable', () => {
    expect(new DummyClass()).toBeInstanceOf(DummyClass)
  })
  it('calls hello method', () => {
    let name = 'mars'
    let expected = `Hello ${name}`
    expect(new DummyClass().hello(name)).toEqual(expected)
  })
})
