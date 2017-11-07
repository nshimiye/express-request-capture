/**
 * old refers to the https://github.com/clearonline-org/express-request-capture v0.0.3
 * @TODO use a different mocking package because ''
 */
import express, { Express, Request, Response } from 'express'
import * as httpMocks from 'node-mocks-http'
import * as sinon from 'sinon'

// import * as capture from '../../../src/v2' => this does not work because it exposes the default function as [capture.default]
import capture from '../../../src/v2'

describe('Test capture function', () => {
  let expressApp
  let routeGetHandler
  let response
  let responseData = 'Hello World!'
  beforeEach(done => {
    routeGetHandler = (req, res) => res.status(200).send(responseData)
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

    return done()
  })

  it('calls next after printing the logs', done => {
    expressApp = httpMocks.express()
    let printAdapter = { channel: 'console' }
    expressApp.use(capture(printAdapter))

    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/'
    })

    response = expressApp.response

    routeGetHandler(request, response)

    // @TODO we are testing "capture middleware"
    // @TODO create the expectation

    const data = response._getData()
    expect(data).toEqual(responseData)

    done()
  })
})
