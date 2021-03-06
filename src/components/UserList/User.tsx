import { createRef } from "react"

import "./css/UserList.css"

interface Props {
  setShowCommChoice: (user: User) => void,
  name: string,
  ip: string
}

export default function User(props: Props) {
  const userRef = createRef<HTMLDivElement>()

  const onClick = () => {
    props.setShowCommChoice({ name: props.name, ip: props.ip })
  }

  return (
    <div ref={userRef} className="User" onClick={onClick}>
      <p className="UserName">{props.name}</p>
      <p className="Ip">{props.ip}</p>
    </div>
  )
}
