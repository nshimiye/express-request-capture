import * as httpMocks from 'node-mocks-http'
import * as sinon from 'sinon'

import { capture } from '../../src/express-request-capture'

describe('Test capture function', () => {
  let routeGetHandler
  let response
  beforeEach(done => {
    routeGetHandler = (req, res) =>
      res
        .status(200)
        .send('Hello Express Request Capture, received GET request')
    /*
// The app to be tested

import * as Express from 'express'
const app = new express()

app.use(expressCapture.capture)
// or
app.use((req, res, next) => {
    return expressCapture.capture(req, res, next)
})

app.get('/logs', route)
app.post('/logs', (req, res) => {
    return res.status(200).send('Hello Express Request Capture, received POST request')
})
app.put('/logs/:id', (req, res) => {
    return res.status(200).send('Hello Express Request Capture, received PUT request')
})
app.delete('/log/:id', (req, res) => {
    return res.status(200).send('Hello Express Request Capture, received DELETE request')
})
*/
    response = httpMocks.createResponse()

    return done()
  })

  it('DummyClass is instantiable', () => {
    var request = httpMocks.createRequest({
      method: 'GET',
      url: '/logs'
    })

    // expressCapture.capture(null, null, null)
    let nextSpy = sinon.spy()
    expect(capture()(request, response, nextSpy))
    routeGetHandler(request, response)
    expect(nextSpy.calledOnce).toEqual(true)

    // var data = JSON.parse(response._getData())
    var data = response._getData()
    console.log(data)
    // test.equal("Bob Dog", data.name);
    // test.equal(42, data.age);
    // test.equal("bob@dog.com", data.email);
    // test.equal(200, response.statusCode );
    // test.ok( response._isEndCalled());
    // test.ok( response._isJSON());
    // test.ok( response._isUTF8());
    // test.done();
  })
})
