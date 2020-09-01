import React from 'react';
import ReactDOM from 'react-dom';
import './css/RootStyle.css';
import * as serviceWorker from './serviceWorker';
import MessageComponentContainer from './components/containers/MessageComponentContainer';
import UserList from './components/UserList';
import PendingTransfers from './components/PendingTransfers';
import TransferStatus from './components/TransferStatus';
import ftClient from './appReducer';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

const defaultChannels = [
    {
        user: "Info",
        index: 0,
        channelMessages: [
            {
                content: "You are not messaging anybody at the moment.",
                author: "Info"
            }
        ]
    }
]

const initState = {
    channels: defaultChannels,
    currentChannel: 0
}
const store = createStore(ftClient, initState);

ReactDOM.render(
    <Provider store={store}>
        <div className="AppDiv">
            <MessageComponentContainer />
            <div className="Col">
                <UserList />
                <PendingTransfers />
                <TransferStatus />
            </div>
        </div>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();