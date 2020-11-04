import Axios from 'axios'
import Token from './token'

// classes
import Auth from './auth'
import App from './app'
import Users from './users'
import Chats from './chats'
import Messages from './messages'
import Events from './Events'

// api setup
// const server = 'http://localhost:3000';
const server = 'https://povidom-backend.herokuapp.com';

const API = Axios.create({
    baseURL: `${server}/api/v1/`,
    timeout: 10000
});

API.interceptors.request.use((config) => {
    if (Token.get()) {
        config.headers.authorization = 'Bearer ' + Token.get()
    }

    return config
});

API.interceptors.response.use(
    // success
    response => response,

    // error
    error => {
        // if no connection
        if (error.request.status === 0) {
            error.response = {
                status: 0,
                data: {
                    message: 'Service not available at the moment'
                }
            };
        }
        return Promise.reject(error.response)
    }
);

// main class
class PovidomAPI {
    constructor () {
        this.App = App;
        this.Users = Users;
        this.Auth = Auth;
        this.Messages = Messages;
        this.Chats = Chats;
        this.Events = new Events(server)
    }
}

let Povidom = new PovidomAPI();

export { Povidom, API }