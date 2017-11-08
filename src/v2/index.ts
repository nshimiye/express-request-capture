/*
 * 1. https://stackoverflow.com/questions/18538537/time-requests-in-nodejs-express
 * 2. https://github.com/expressjs/body-parser
 * 3. https://github.com/Raynos/body
 * 4. https://github.com/expressjs/express/issues/1816
 * 5. https://stackoverflow.com/questions/19215042/express-logging-response-body
 */
import { Express, Request, Response } from 'express'

import { capture as captureWorker, ERCIRequest, ERCIResponse } from './capture' // captureRequestData
import printer from './printer'
// var printAdapter = { channel: 'console|http|mongo|mysql', url: 'required if channel is either http or database' }
export interface IPrintAdapter {
  channel: string
  url?: string // not needed for console channel
}
export default function capture(printAdapter: IPrintAdapter) {
  return function(req: ERCIRequest, res: ERCIResponse, next: () => any) {
    return (
      captureWorker(req, res, next) // capture calls next!
        .then((data: any) =>
          printer.print(data, printAdapter.channel, printAdapter)
        )
        // .then(data => { console.log('success', data); return printer.print(data, printAdapter.channel, printAdapter)})
        .catch((e: Error) =>
          console.error(`[${new Date()}]-[express-request-capture]`, e)
        )
    )
  }
}
