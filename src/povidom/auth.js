import { API } from './'
import Token from './token'

export default class {
    static async login (data) {
        let response = await API.post('auth/login', {
            credentials: data
        });

        let token = response.data.access_token;

        Token.set(token);

        return true
    }

    static async register (data) {
        let response = await API.post('auth/register', {
            credentials: data
        });

        let token = response.data.access_token;

        Token.set(token);

        return true
    }

    static async logout () {
        Token.remove();

        return true
    }

    static checkAuthState () {
        return Token.isValid()
    }
}