import { executeTransitionOffset } from "lib/TransitionHelper"
import React, { createRef } from "react"
import "./css/UserList.css"

interface IProps {
  displayCommChoice: Function,
  setCurrentTargetUser: Function,
  name: string,
  ip: string
}

export default function User(props: IProps) {
  const userRef = createRef<HTMLDivElement>()

  const onClick = () => {
    props.setCurrentTargetUser(props.name)

    executeTransitionOffset(userRef.current!, () => {
      props.displayCommChoice(true)
    }, -10)
  }

  return (
    <div ref={userRef} className="User" onClick={onClick}>
      <p className="UserName">{props.name}</p>
      <p className="Ip">{props.ip}</p>
    </div>
  )
}
