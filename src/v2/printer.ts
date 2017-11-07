export function print(data: any, channel: any, options: any) {
  console.log(data)
  return Promise.resolve(true)
}

export default {
  print
}
