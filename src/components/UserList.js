import React from 'react';
import '../css/Window.css';
import '../css/MiniComponents.css';
import User from './User';
import uniqid from 'uniqid';
import _ from 'lodash';
import { w3cwebsocket as WebSocketClient } from 'websocket';
import PropTypes from 'prop-types';

class UserList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {users:[]}

        this.userUpdateClient = new WebSocketClient("ws://localhost:4001")
        this.userUpdateClient.onopen = () => {
            console.log("Connected to backend.")
            this.userUpdateClient.send("Connected")
        }
        this.userUpdateClient.onmessage = (message) => {
            console.log(message)
            var messageObj = JSON.parse(message.data);
            switch (messageObj.type) {
                case "addUser":
                    console.log(messageObj)
                    this.addUser(messageObj.user)
                    break;
                case "removeUser":
                    this.removeUser(messageObj.user)
                    break;
                default:
                    break;
            }
        }
    }
    
    async addUser(user) {
        console.log(user, this.props.hostname)
        while (this.props.hostname === undefined) {await new Promise(r => setTimeout(r, 1))}
        if (user.name === this.props.hostname.value) {
            return
        }
        var newUsers = _.cloneDeep(this.state.users)
        newUsers.push(user)
        this.setState({users:newUsers})
    }

    removeUser(user) {
        var newUsers = _.cloneDeep(this.state.users)
        newUsers.splice(newUsers.indexOf(user), 1)
        this.setState({users:newUsers})
    }
    
    render() {
        return (
            <div className="Window" style={{height: "40%"}}>
                <p className="Title">User List</p>
                <div className="ComponentContainer">
                    {this.state.users.map((user)=>{
                        return <User key={uniqid()} name={user.name} ip={user.ip} />
                    })}
                </div>
            </div>
        );
    }
}

UserList.propTypes = {
    hostname: PropTypes.object.isRequired
}

export default UserList;