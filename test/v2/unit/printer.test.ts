import * as httpMocks from 'node-mocks-http'
import * as sinon from 'sinon'

import { print } from '../../../src/v2/printer'

describe('Test capture function', () => {
  let routeGetHandler
  let response
  beforeEach(done => {
    routeGetHandler = (req, res) =>
      res
        .status(200)
        .send('Hello Express Request Capture, received GET request')

    response = httpMocks.createResponse()

    return done()
  })

  it('DummyClass is instantiable', () => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/logs'
    })
    // @TODO
    let data = {
      url: 'test.com',
      request: 'NA',
      response: 'NA'
    }
    return print(data, 'http', {
      channel: 'http',
      url: 'https://localhost:3000/api/log-request',
      headers: {
        apiKey: ''
      }
    }).then(success => {
      console.log(success)
      expect(success).toBeTruthy()
    })
  })
})
