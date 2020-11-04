import { API } from './'
import {normalizeSchema} from "./schema";

export default class {
    static async getMessages (params) {
        let response = await API.get('messages/',{ params });

        let messages = response.data.messages;

        // let normalized = normalizeSchema('messageList', messages);

        return messages
    }

    static async sendMessage (message) {
        let response = await API.post('messages/', { message });

        return response.data.message;
    }

    static async updateMessage (message) {
        let response = await API.put('messages/', { message });

        return response.data.message;
    }

    static async deleteMessage (message) {
        let response = await API.delete('messages/', { params: message });

        return response.data.message;
    }

    static async readMessages (chatID) {
        let response = await API.get('messages/read', { params: chatID });

        return response.data;
    }
}