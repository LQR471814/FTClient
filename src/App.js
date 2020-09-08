import React from 'react';
import SetupMulticastBanner from './components/SetupMulticastBanner';
import MessageComponentContainer from './components/containers/MessageComponentContainer';
import UserList from './components/UserList';
import PendingTransfers from './components/PendingTransfers';
import TransferStatus from './components/TransferStatus';
import NetInterfaceChoice from './components/NetInterfaceChoice'
import { w3cwebsocket as WebSocketClient } from 'websocket';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showChoiceNetworkInterfaces: false,
            showSetupBanner: false
        }
        
        this.displayChoiceNetworkInterfaces = this.displayChoiceNetworkInterfaces.bind(this)

        this.resourceSocket = new WebSocketClient("ws://localhost:4000")
        this.resourceSocket.onopen = () => {
            this.resourceSocket.send(JSON.stringify({name: "getOS", parameters: {}}))
        }
        this.resourceSocket.onmessage = (message) => {
            var messageObj = JSON.parse(message.data);
            console.log(messageObj)
            switch (messageObj.type) {
                case "getInterfaces":
                    this.NetInterfaceChoiceElement.current.setInterfaces(JSON.parse(messageObj.response))
                    break;
                case "setInterfaces":
                    console.log(messageObj.response)
                    break;
                case "getOS":
                    this.os = messageObj.response
                    if (this.os === "Windows") {
                        console.log(this.os)
                        this.showSetupBanner(true)
                    }
                    break;
                default:
                    break;
            }
        }

        this.NetInterfaceChoiceElement = React.createRef();
    }

    displayChoiceNetworkInterfaces(show) {
        this.setState({showChoiceNetworkInterfaces: show})
    }

    showSetupBanner(show) {
        this.setState({showSetupBanner: show})
    }
    
    render() {
        return (
            <div style={{height: "100%"}}>
                <div className="AppDiv" id="AppGrid">
                    {this.state.showSetupBanner && <SetupMulticastBanner displayChoiceNetworkInterfaces={this.displayChoiceNetworkInterfaces} />}
                    <MessageComponentContainer />
                    <div className="Col" style={{overflow: "hidden"}}>
                        <UserList />
                        <PendingTransfers />
                        <TransferStatus />
                    </div>
                </div>
                {this.state.showChoiceNetworkInterfaces && (<NetInterfaceChoice ref={this.NetInterfaceChoiceElement} resourceClient={this.resourceSocket} />)}
            </div>
        )
    }
}

export default App;