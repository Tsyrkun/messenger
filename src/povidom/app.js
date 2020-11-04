import { API } from './'

export default class {
    static async preload () {
        let response = await API.get('app/preload');

        return response.data.user
    }
}