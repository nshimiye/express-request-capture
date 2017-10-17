// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
export interface RequestLog {
  url: string
  request: {
    headers: { [key: string]: string }
    payload: any
  }
  response: {
    headers: { [key: string]: string }
    payload: any
  }
}

export interface Channel {
  name: string
  url: string | undefined
}

export class ExpressCaptureClass {
  /**
   * @private
   * where you want want to print your data
   * url is either the http url or absolute path(if channel is a local file)
   */
  private channel: Channel

  /**
   * 
   * @param {Channel} channel 
   * @return {ExpressCaptureClass} for chaining purposes
   */
  public setChannel(channel: Channel): ExpressCaptureClass {
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
export const capture = expressCapture.capture
