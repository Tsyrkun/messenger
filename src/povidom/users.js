import { API } from './'

export default class {
    static async getSelf () {
        let response = await API.get('users/self');

        let user = response.data.user;

        return user
    }

    static async setAvatar (data) {
        let response = await API.post('users/setAvatar', data);

        return response.data;
    }

    static async search (params) {
        let response = await API.get('users/search', {
            params
        });

        let users = response.data.users;

        return users
    }
}