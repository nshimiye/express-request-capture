import Express from 'express'
let requestTest = require('supertest')

import capture from '../../../src/v2'

describe('Test capture function', () => {
  let routeGetHandler
  let routePostHandler
  let routePostErrorHandler
  let routePutHandler
  let routeDeleteHandler
  let response
  let app
  let server
  beforeAll(done => {
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
    app.use(capture({ channel: 'console' }))

    app.get('/logs', routeGetHandler)
    app.post('/logs', routePostHandler)
    app.post('/logs/500', routePostErrorHandler)
    app.put('/logs/:id', routePutHandler)
    app.delete('/logs/:id', routeDeleteHandler)

    server = app.listen(3000, () => done())
  })

  afterAll(done => {
    server.close()
    done()
  })

  it('logs get request', () => {
    const getRquest = requestTest(app)['get']
    return getRquest('/logs').then(response => {
      expect(response.statusCode).toBe(200)
    })
  })

  it('logs successful post request', () => {
    const postRquest = requestTest(app)['post']
    return postRquest('/logs').then(response => {
      expect(response.statusCode).toBe(200)
    })
  })
  it('logs successful post request with json payload', () => {
    let postRquest = requestTest(app)['post']
    // .field('name', 'my awesome avatar')

    return postRquest('/logs')
      .set('Accept', 'application/json')
      .send({ name: 'my awesome avatar' })
      .then(response => {
        expect(response.statusCode).toBe(200)
      })
  })
  it('logs successful post request with text payload', () => {
    let postRquest = requestTest(app)['post']
    // .field('name', 'my awesome avatar')

    return postRquest('/logs')
      .set('Accept', 'text/plain')
      .send('name is my awesome avatar')
      .then(response => {
        expect(response.statusCode).toBe(200)
      })
  })
  it('logs successful post request with form payload', () => {
    let postRquest = requestTest(app)['post']

    return postRquest('/logs')
      .field('name', 'my awesome avatar')
      .then(response => {
        expect(response.statusCode).toBe(200)
      })
  })

  it('logs failing post request', () => {
    const postRquest = requestTest(app)['post']
    return postRquest('/logs/500').then(response => {
      expect(response.statusCode).toBe(500)
    })
  })
  it('logs put request', () => {
    const putRquest = requestTest(app)['put']
    return putRquest('/logs/1').then(response => {
      expect(response.statusCode).toBe(200)
    })
  })
  it('logs delete request', () => {
    const deleteRquest = requestTest(app)['delete']
    return deleteRquest('/logs/1').then(response => {
      expect(response.statusCode).toBe(200)
    })
  })

  it('logs unhandled request', () => {
    const getRquest = requestTest(app)['get']
    return getRquest('/logs-unhandled/').then(response => {
      expect(response.statusCode).toBe(404)
    })
  })
})
