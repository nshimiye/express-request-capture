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

export class ExpressCapture {
  public hello(name: string): string {
    return `Hello ${name}`
  }

  public capture(req: any, res: any, next: () => any): RequestLog {
    let url = ''
    let payload = ''
    let headers = {}
    let request = { headers, payload }
    let response = { headers, payload }
    return Object.assign({}, { url, request, response })
  }
}

let expressCapture = new ExpressCapture()
export const hello = expressCapture.hello
export const capture = expressCapture.capture
