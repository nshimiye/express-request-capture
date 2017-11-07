import Express from 'express'
import requestTest from 'supertest'

import { capture, channels, statusCodeMap } from '../../../src/v2'

describe('Test capture function', () => {
  let routeGetHandler
  let routePostHandler
  let routePostErrorHandler
  let routePutHandler
  let routeDeleteHandler
  let response
  let app
  let server
  beforeEach(done => {
    routeGetHandler = (req, res) =>
      res
        .status(200)
        .send('Hello Express Request Capture, received GET request')
    routePostHandler = (req, res) =>
      res
        .status(200)
        .send('Hello Express Request Capture, received POST request')
    routePostErrorHandler = (req, res) =>
      res
        .status(500)
        .send('Hello Express Request Capture, received POST request')
    routePutHandler = (req, res) =>
      res
        .status(200)
        .send('Hello Express Request Capture, received PUT request')
    routeDeleteHandler = (req, res) =>
      res
        .status(200)
        .send('Hello Express Request Capture, received DELETE request')

    // The app to be tested

    app = Express()

    // app.use(capture())
    // or
    // app.use((req, res, next) => capture()(req, res, next))
    // or if you want to capture requests with status code of either 200 or 500
    app.use(
      capture(channels.CONSOLE, [statusCodeMap.OK200, statusCodeMap.ERROR500])
    )

    app.get('/logs', routeGetHandler)
    app.post('/logs', routePostHandler)
    app.post('/logs/500', routePostErrorHandler)
    app.put('/logs/:id', routePutHandler)
    app.delete('/log/:id', routeDeleteHandler)

    server = app.listen(3000, () => done())
  })

  afterAll(() => {
    server.close()
  })

  it('logs get request', () => {
    const getRquest = requestTest(app)['get']
    return getRquest('/logs').then(response => {
      expect(response.statusCode).toBe(200)
    })
  })
})
