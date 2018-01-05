import { URL, resolve } from 'url'

const https = require('https')

export interface IPrintAdapter {
  channel: string
  url?: string // not needed for console channel
  headers?: { [key: string]: string } // not needed for console channel
}

export interface ERCHeaders {
  [key: string]: string
}

export function print(
  data: any,
  channel: string,
  options: IPrintAdapter
): Promise<boolean> {
  switch (channel) {
    case 'console':
      return consolePrinter(data)
    case 'http':
      if (options.url && options.headers) {
        return httpPrinter(data, options.url, options.headers)
      }
      return Promise.reject(new Error('Missing parameters'))
    case 'mongo':
      if (options.url && options.headers) {
        return mongoPrinter(data, options.url)
      }
      return Promise.reject(new Error('Missing parameters'))
    default:
      return Promise.reject(new Error('Unknown channel'))
  }
}

export function consolePrinter(data: any): Promise<boolean> {
  console.log(data)
  return Promise.resolve(true)
}

export function httpPrinter(
  data: any,
  url: string,
  headers: ERCHeaders
): Promise<boolean> {
  return new Promise(resolve => {
    let urlInstance = new URL(url)
    let { host, hostname, port, pathname } = urlInstance
    postToRemote(hostname, port, pathname, data, headers)
  })
}
export function mongoPrinter(data: any, url: string): Promise<boolean> {
  return Promise.reject('NOT Implemented')
}

// START helper
// source: https://in.godaddy.com/help/how-to-make-an-http-post-request-in-nodejs-12366
export function postToRemote(
  host: string,
  port = '80',
  path: string,
  headers: ERCHeaders,
  data: { [key: string]: any }
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    // Build the post string from an object
    let postData = JSON.stringify(data)

    // An object of options to indicate where to post to
    let postOptions = {
      host,
      port,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }

    // Set up the request
    let postReq = https.request(postOptions, (res: any) => {
      console.log('Status: ' + res.statusCode)
      console.log('Headers: ' + JSON.stringify(res.headers))
      res.setEncoding('utf8')

      res.on('data', (chunk: any) => {
        console.log('Response: ' + chunk)
        return resolve(true)
      })
    })
    postReq.on('error', (e: Error) => {
      console.log('problem with request: ' + e.message)
      return reject(e)
    })
    // post the data
    postReq.write(postData)
    postReq.end()
  })
}
// END helper
