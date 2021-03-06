declare module "*.svg" { //? Fix svg imports
  import React = require("react")
  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

interface Transfer {
  worker: Worker
  state: TransferState
}

interface TransferState {
  status: string
}

interface IMessageGroup {
  messages: IMessage[]
  collapsed: number
}

interface IMessage {
  content: string
  author: string
}

interface User {
  name: string,
  ip: string
}

type INetInterface = [string, string, string] //? ID, Name, IP

type Primitive = string | number | bigint | boolean | symbol