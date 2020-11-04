import Token from "./token";
import socket from "socket.io-client";

class Events {
    constructor (origin) {
        this.origin = origin;
    }

    connect () {
        let token = Token.get();

        this.socket = socket(`${this.origin}`, {
            autoConnect: false,
            forceNew: false,
            query: {
                token
            }
        });

        this.users = socket(`${this.origin}/users`, {
            autoConnect: false,
            forceNew: false,
            query: {
                token
            }
        });

        this.chats = socket(`${this.origin}/chats`, {
            autoConnect: false,
            forceNew: false,
            query: {
                token
            }
        });

        this.private = socket(`${this.origin}/private`, {
            autoConnect: false,
            forceNew: false,
            query: {
                token
            }
        });

        this.socket.open();
        this.users.open();
        this.chats.open();
        this.private.open();
    }

    disconnect () {
        if (this.socket) {
            this.socket.close();
            this.users.close();
            this.chats.close();
            this.private.close();
        }
    }

    subscribe (to, ids) {
        if (to === 'users') this.users.emit('subscribe', ids);
        if (to === 'chats') this.chats.emit('subscribe', ids);
        if (to === 'private') this.private.emit('subscribe')
    }

    unsubscribe (from, ids) {
        if (from === 'users') this.users.emit('unsubscribe', ids);
        if (from === 'chats') this.chats.emit('unsubscribe', ids);
        if (from === 'private') this.private.emit('unsubscribe')
    }

    onConnect (callback) {
        this.socket.on('connect', () => {
            callback()
        });
    }

    onDisconnect (callback) {
        this.socket.on('disconnect', () => {
            callback()
        });
    }

    onChat (callback) {
        this.private.on('chat', (data) => {
            callback(data)
        })
    }

    onTyping (callback) {
        this.chats.on('typing', (data) => {
            callback(data)
        })
    }

    onMessage (callback) {
        this.chats.on('message', (data) => {
            callback(data)
        });
    }

    onUserActivity (callback) {
        this.users.on('activity', (data) => {
            callback(data)
        });
    }

    typing (action) {
        this.chats.emit('typing', action)
    }

    onError (callback) {
        this.socket.on('error', (error) => {
            callback(error)
        });
    }

    emitOnline () {
        this.private.emit('online')
    }

    emitOffline () {
        this.private.emit('offline')
    }
}

export default Events;