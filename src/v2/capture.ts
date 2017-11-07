import { Request, Response } from 'express'
const textBody = require('body')
const jsonBody = require('body/json')
const formBody = require('body/form')
const anyBody = require('body/any')

export const ContentTypes = {
  TEXT_PLAIN: 'text/plain',
  APPLICATION_FORM: 'application/x-www-form-urlencoded',
  APPLICATION_JSON: 'application/json'
}

export interface RequestLog {
  url: string
  request: {
    method: string
    headers: any // @TODO
    host: string
    clientIp: string
    payload: any // @TODO
  }
  respone: {
    headers: any // @TODO
    status: number
    payload: any // @TODO
  }
  latency: number
}
export interface ERCIRequest extends Response {
  _headers: any
}

/**
 * 
 * @param {string} contentType req.get('content-type')
 * @param {Request} req
 * @param {Response} res
 * @param { [key: number|string]: any } options
 * @returns Promise< string | { [key: number|string]: any }> the parsed body
 */
export function parseRequestBody(
  contentType: string,
  req: Request,
  res: Response,
  options
) {
  let bodyParser
  switch (contentType) {
    case ContentTypes.TEXT_PLAIN:
      bodyParser = new Promise(r => textBody(req, (err, body) => r(body)))
      break
    case ContentTypes.APPLICATION_FORM:
      bodyParser = new Promise(r => formBody(req, {}, (err, body) => r(body)))
      break
    case ContentTypes.APPLICATION_JSON:
      bodyParser = new Promise(r => jsonBody(req, res, (err, body) => r(body)))
    default:
      bodyParser = new Promise(r =>
        anyBody(req, res, {}, (err, body) => r(body))
      )
      break
  }

  return bodyParser
}

/**
 * @dependancy: called after parseRequestBody
 * @param res Express.Response
 * @param options { [key: number|string]: any }
 * @return Promise<string | { [key: number|string]: any }> the parsed body
 */
export function parseResponseBody(
  res: Response | { write: any; end: any; once: any },
  options,
  next: () => any
) {
  return new Promise((resolve, reject) => {
    let write = res.write
    let end = res.end
    let chunks: Array<Buffer | any> = []
    res.write = function newWrite(chunk: Buffer | string) {
      // console.log('newWrite', chunk);
      chunks.push(chunk)
      write.apply(res, arguments)
    }

    res.end = function newEnd(chunk: Buffer | String) {
      // console.log('newEnd', chunk);
      if (chunk) {
        // chunks.push(chunk);
      }
      end.apply(res, arguments)
    }

    res.once('finish', function() {
      // console.log('finish')
      const isBuffer = (input: Buffer | String) => input instanceof Buffer
      const responseBody = isBuffer(chunks[0])
        ? Buffer.concat(chunks).toString('utf8')
        : chunks.toString()
      console.log('response body', arguments)

      // @TODO here is where you compute the latency

      return resolve(responseBody)
    })
    console.log('S - calling next')
    return next()
  })
}

/**
 * @dependancy: called after parseResponseBody
 * @param req {Express.Request}
 * @returns Promise< string | { [key: number|string]: any }> the parsed body
 */
export function parseUrl(req: Request) {
  const protocol = req.protocol || req.get('X-Forwarded-Protocol')
  const host = req.hostname || req.get('host')
  const path = req.originalUrl || req.url
  // console.log('url', `${protocol}://${host}${path}`);

  return `${protocol}://${host}${path}`
}

/**
 * @dependancy: called after parseResponseBody
 * @param req {Express.Request}
 * @returns { method: string, headers: { [key: string]: string|number }, host: string, clientIp: string }
 */
export function parseRequestMeta(req: Request) {
  const method = req.method
  // console.log('method', method);

  const headers = req.headers
  // console.log('request headers', headers);

  const host = req.get('host')
  // console.log('request host', host);
  const clientIp = req.headers['x-forwarded-for'] || req.ip
  // console.log('request clientIp', clientIp);

  return { method, headers, host, clientIp }
}

/**
 * @dependancy: called after parseResponseBody
 * @param res {Express.Response}
 * @returns { status: string, headers: { [key: string]: string|number } }
 */
export function parseResponseMeta(res: ERCIRequest) {
  const headers = res._headers
  // console.log('response headers', headers);

  const status = res.statusCode
  // console.log('status', status);

  return { headers, status }
}

/**
 * the middleware entry
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @return Promise<Re>
 */
export function capture(req: Request, res, next): Promise<RequestLog> {
  const start = Date.now()
  const contentType = req.get('content-type')
  let options = {}
  let data = { url: '', request: {}, respone: {}, latency: 0 } // output
  return parseRequestBody(contentType, req, res, options)
    .then(payload => {
      // => request body
      data.request = Object.assign({}, data.request, { payload })
      let options = {}
      return parseResponseBody(res, options, next)
    })
    .catch(e => {
      console.log('F - calling next', e) // @TODO why do i have to call next in here?
      next()
      // in here we should stop the execution
      return Promise.reject(e)
    })
    .then(payload => {
      // => response body
      console.log('success 1', payload)
      data.respone = Object.assign({}, data.respone, { payload })

      let url = parseUrl(req)
      data = Object.assign({}, data, { url })

      let { method, headers, host, clientIp } = parseRequestMeta(req)
      data.request = Object.assign({}, data.request, {
        method,
        headers,
        host,
        clientIp
      })

      return Promise.resolve(data)
    })
    .then(data => {
      // => response meta

      let { headers, status } = parseResponseMeta(res)
      data.respone = Object.assign({}, data.respone, { headers, status })

      let latency = Date.now() - start
      data = Object.assign({}, data, { latency })

      return Promise.resolve(data)
    })
  // let the index file catch whatever fails
}
