// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
export interface RequestInterface {
  headers: { [key: string]: string }
  payload?: any
}
export interface ResponseInterface {
  headers: { [key: string]: string }
  payload?: any
}
export interface RequestLog {
  url: string
  request: RequestInterface
  response: ResponseInterface
}

export interface ChannelInterface {
  name: string
  url?: string | undefined
}

export interface statusCodeInterface {
  OK200: string
  OK300: string
  ERROR400: string
  ERROR500: string
  OTHER: string
  [key: string]: string
}

export interface ChannelsInterface {
  DEFAULT: ChannelInterface
  CONSOLE: ChannelInterface
}

export class ExpressCaptureClass {
  /**
   * @private
   * where you want want to print your data
   * url is either the http url or absolute path(if channel is a local file)
   */
  private channel: ChannelInterface

  /**
   * 
   * @param {Channel} channel 
   * @return {ExpressCaptureClass} for chaining purposes
   */
  public setChannel(channel: ChannelInterface): ExpressCaptureClass {
    this.channel = channel
    return this
  }

  /**
   * @TODO it can be called alone, in this case it will assume that the channel is console
   * @param req 
   * @param res 
   * @param next 
   */
  public capture(req: any, res: any, next: () => any): RequestLog {
    let url = ''
    let payload = ''
    let headers = {}
    let request = { headers, payload }
    let response = { headers, payload }
    return Object.assign({}, { url, request, response })
  }
}

export const expressCapture = new ExpressCaptureClass()

export const channels: ChannelsInterface = {
  DEFAULT: { name: 'console' },
  CONSOLE: { name: 'console' }
}

export const statusCodeMap: statusCodeInterface = {
  OK200: '200',
  OK300: '300',
  ERROR400: '400',
  ERROR500: '500',
  OTHER: 'OTHER'
}
let statusCodeList  = Object.keys(statusCodeMap).map(key => statusCodeMap[key])

export function lookupByChannel(
  channel: ChannelInterface = channels.DEFAULT
): {
  log: (
    url: string,
    request: RequestInterface,
    response: ResponseInterface
  ) => Promise<any>
} {
  const log = (
    url: string,
    request: RequestInterface,
    response: ResponseInterface
  ) =>
    new Promise(resolve => {
      let requestLog: RequestLog = { url, request, response }
      console.log(requestLog)
    })
  return { log }
}
/**
 * 
 * @param channel 
 * @param status the list of status that will trigger logging, useful if you want to log "failed requests" (status of 500) only for example
 */
export function capture(
  channel: ChannelInterface = channels.DEFAULT,
  status: string | Array<string> = statusCodeList
) {
  return function(req: any, res: any, next: () => any): () => any {
    let rq = { headers: {} }
    let rs = { headers: {}, payload: null }
    lookupByChannel(channel).log(req.baseUrl, rq, rs)
    return next()
  }
}
