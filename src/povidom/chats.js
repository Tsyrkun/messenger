import { API } from './'

import { normalizeDialog } from "./schema";

export default class {
    static async getDialog(params) {
        let response = await API.get('chats/dialog', {params});

        return response.data.dialog
    }

    static async createGroup(data) {
        let response = await API.post('chats/createGroup', data);

        return response.data
    }

    static async clearHistory(chatID) {
        let response = await API.get('chats/clearHistory', {params: {chatID}});

        return response.data;
    }

    static async deleteDialog(chatID) {
        let response = await API.get('chats/deleteDialog', {params: {chatID}});

        return response.data;
    }

    static async setNotifications(data) {
        let response = await API.get('chats/setNotifications', {params: data});

        return response.data;
    }
}