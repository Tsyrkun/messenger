import Vue from 'vue'
import Vuex from 'vuex'
import Lodash from 'lodash'
import {Povidom, API} from "../povidom";
import Notifications from '../notifications'

import modules from './modules'
import {normalizeDialog, normalizeUser} from "../povidom/schema";

Vue.use(Vuex);

let initialState = () => {
    return {
        connected: false,
        mobile: false,
        voiceRecognition: true,

        currentUser: {},
        currentChat: null,
        editMessage: null,
        deleteMessage: null,

        modals: {
            users: false,
            newGroup: false,
            settings: false,
            setAvatar: false
        },

        chats: {},
        dialogs: {},
        users: {},
        messages: {},
        typing: {}
    };
};

export default new Vuex.Store({
    modules,
    state: initialState(),
    getters: {
        connected (state) {
            return state.connected
        },

        voiceRecognition (state) {
            return state.voiceRecognition
        },

        currentChat (state) {
            return state.currentChat
        },

        editMessage (state) {
            return state.editMessage
        },

        deleteMessage (state) {
            return state.deleteMessage
        },

        mobile (state) {
            return state.mobile
        },

        modals (state) {
            return state.modals
        },

        currentUser (state) {
            return state.currentUser
        },

        dialogs (state) {
            return Object.values(state.dialogs)
        },

        chats (state) {
            return Object.values(state.chats)
        },

        users (state) {
            return Object.values(state.users)
        },

        userCollection (state) {
            return state.users
        },

        dialogCollection (state) {
            return state.dialogs
        },

        chatCollection (state) {
            return state.chats
        },

        chatMembers (state) {
            return chatID => {
                return state
                    .chats[chatID]
                    .members
                    .map(member => state.users[member])
            }
        },

        chatByID (state) {
            return chatID => state.chats[chatID]
        },

        dialogByID (state) {
            return dialogID => state.dialogs[dialogID]
        },

        dialogByChatID (state) {
            return chatID => Object.values(state.dialogs).find(dialog => dialog.chat === chatID)
        },

        userByID (state) {
            return userID => state.users[userID]
        },

        messageByID (state) {
            return messageID => state.messages[messageID]
        },

        dialogMessages (state) {
            return dialogID => {
                if (state.dialogs[dialogID]) {
                    let messages = Array
                        .from(state.dialogs[dialogID].messages);

                    return messages
                        .map(m => state.messages[m])
                        .sortBy('createdAt')
                } else {
                    return []
                }
            }
        },

        typing (state) {
            return chatID => state.typing[chatID]
        },

        unreadCountOtherChats (state) {
            return chatID => {
                let dialogs = Object.values(state.dialogs).filter(dialog => dialog.chat !== chatID);

                return dialogs.reduce((total, current) => {
                    return total + current.unreadCount
                }, 0)
            }
        }
    },
    mutations: {
        clearState (state) {
            Object.assign(state, initialState())
        },

        set_connection (state, bool) {
            state.connected = bool
        },

        set_voiceRecognition (state, bool) {
            state.voiceRecognition = bool
        },

        set_currentChat (state, chat) {
            state.currentChat = chat
        },

        set_currentUser (state, user) {
            state.currentUser = user
        },

        set_editMessage (state, message) {
            state.editMessage = message
        },

        set_deleteMessage (state, message) {
            state.deleteMessage = message
        },

        set_typing (state, {typing, chatID, userID}) {
            if (typing) {
                state.typing[chatID] = Object.assign({}, state.typing[chatID], {[userID]: true})
            } else {
                delete state.typing[chatID][userID];
                state.typing = Object.assign({}, state.typing)
            }
        },

        update_user (state, user) {
            state.users[user._id] = Object.assign({}, state.users[user._id], user)
        },

        set_mobile (state, bool) {
            state.mobile = bool
        },

        set_modal (state, {name, value}) {
            state.modals[name] = value
        },

        set_chats_many (state, chats) {
            state.chats = Object.assign({}, state.chats, chats)
        },

        set_dialogs_many (state, dialogs) {
            state.dialogs = Object.assign({}, state.dialogs, dialogs)
        },

        set_users_many (state, users) {
            state.users = Object.assign({}, state.users , users)
        },

        set_messages_many (state, messages) {
            state.messages = Object.assign({}, state.messages, messages)
        },

        dialog_add_unread (state, chatID) {
            let dialogs = Object.values(state.dialogs);
            let dialog = dialogs.find(d => d.chat === chatID);

            state.dialogs[dialog._id].unreadCount += 1
        },

        dialog_set_scroll (state, {chatID, scrolled}) {
            let dialogs = Object.values(state.dialogs);
            let dialog = dialogs.find(d => d.chat === chatID);

            state.dialogs[dialog._id].scrolled = scrolled
        },

        set_message (state, message) {
            state.messages = Object.assign({}, state.messages, {[message['_id']]: message});

            let dialogs = Object.values(state.dialogs);
            let dialog = dialogs.find(d => d.chat === message.chat);

            dialog.messages.push(message._id);
            state.dialogs[dialog._id].messages = dialog.messages
        },

        update_message (state, message) {
            let updateMessage =  Object.assign(state.messages[message._id], message);
            state.messages = Object.assign({}, state.messages, {[message['_id']]: updateMessage});
        },

        delete_message (state, message) {
            delete state.messages[message['_id']];

            let dialogs = Object.values(state.dialogs);
            let dialog = dialogs.find(d => d.chat === message.chat);

            let index = dialog.messages.indexOf(message['_id']);

            if (index > -1) dialog.messages.splice(index, 1);

            state.dialogs[dialog._id].messages = dialog.messages
        },

        readMessages (state, {chatID, userID}) {
            let dialogs = Object.values(state.dialogs);
            let dialog = dialogs.find(d => d.chat === chatID);

            let messageIDs = dialog.messages;

            messageIDs.forEach(m => {
                if (m.author !== userID && !m.read) {
                    state.messages[m].read = true
                }
            });

        },

        remove_messages (state, chatID) {
            let dialogs = Object.values(state.dialogs);
            let dialog = dialogs.find(d => d.chat === chatID);

            dialog.messages.forEach(m => {
                delete state.messages[m];
            })
        },

        dialog_clear_history (state, chatID) {
            let dialogs = Object.values(state.dialogs);
            let dialog = dialogs.find(d => d.chat === chatID);

            state.dialogs[dialog._id].messages = [];
        },

        dialog_clear_unread (state, chatID) {
            let dialogs = Object.values(state.dialogs);
            let dialog = dialogs.find(d => d.chat === chatID);

            state.dialogs[dialog._id].unreadCount = 0
        },

        add_messages_to_dialog (state, {messages, chatID}) {
            let dialogs = Object.values(state.dialogs);
            let dialog = dialogs.find(d => d.chat === chatID);
            let stack = messages.reverse().concat(dialog.messages);

            state.dialogs[dialog._id].messages = Lodash.uniq(stack);
        },

        dialog_allLoaded (state, {chatID}) {
            let dialogs = Object.values(state.dialogs);
            let dialog = dialogs.find(d => d.chat === chatID);

            state.dialogs[dialog._id] = Object.assign({}, state.dialogs[dialog._id], {loadedAll: true})
        },

        set_dialog_preload (state, chatID) {
            let dialogs = Object.values(state.dialogs);
            let dialog = dialogs.find(d => d.chat === chatID);

            state.dialogs[dialog._id] = Object.assign({}, state.dialogs[dialog._id], {preload: true})
        },

        dialog_activate (state, dialogID) {
            state.dialogs[dialogID].active = true
        },

        dialog_deactivate (state, chatID) {
            let dialogs = Object.values(state.dialogs);
            let dialog = dialogs.find(d => d.chat === chatID);

            state.dialogs[dialog._id].active = false
        },

        dialog_set_notifications (state, {chatID, value}) {
            let dialogs = Object.values(state.dialogs);
            let dialog = dialogs.find(d => d.chat === chatID);

            state.dialogs[dialog._id].notifications = value
        }
    },

    actions: {
        async preload ({commit, dispatch}) {
            try {
                let currentUser = await Povidom.App.preload();

                let {
                    dialogs, chats, messages, members
                } = normalizeUser(currentUser).entities;

                commit('set_currentUser', currentUser);
                commit('set_chats_many', chats);
                commit('set_users_many', members);
                commit('set_dialogs_many', dialogs);
                commit('set_messages_many', messages);

                dispatch('initPovidomService')
            } catch (error) {
                dispatch('Auth/logout')
            }
        },

        async initPovidomService ({commit, getters, dispatch}) {

            Povidom.Events.connect();

            Povidom.Events.onConnect(() => {
                console.log('Socket connected');

                commit('set_connection', true);

                Povidom.Events.subscribe('chats', getters.chats.map(chat => chat._id));
                Povidom.Events.subscribe('users', getters.users.map(user => user._id));
                Povidom.Events.subscribe('private');
            });

            Povidom.Events.onDisconnect(() => {
                console.log('Socket disconnect');

                commit('set_connection', false);

                Povidom.Events.emitOffline();
            });

            Povidom.Events.onChat(event => {
                console.log('Chat action', event);

                if (event.type === 'new') {
                    let {members, chats, dialogs, messages} = normalizeDialog(event.data.dialog).entities;

                    if (!getters.chatCollection[event.data.dialog.chat._id]) {
                        commit('set_chats_many', chats);
                        commit('set_dialogs_many', dialogs);
                        commit('set_users_many', members);
                        commit('set_messages_many', messages);

                        Povidom.Events.subscribe('chats', getters.chats.map(chat => chat._id));
                        Povidom.Events.subscribe('users', getters.users.map(user => user._id));
                    } else {
                        commit('dialog_activate', event.data.dialog._id)
                    }
                }

                else if (event.type === 'clearHistory') {
                    let {chatID, userID} = event.data;

                    if (getters.currentUser._id === userID) {
                        commit('remove_messages', chatID);
                        commit('dialog_clear_history', chatID);
                    }
                } else if (event.type === 'deleteDialog') {
                    let {chatID, userID} = event.data;

                    if (getters.currentUser._id === userID) {
                        commit('remove_messages', chatID);
                        commit('dialog_clear_history', chatID);
                        commit('dialog_deactivate', chatID)
                    }
                }
            });

            Povidom.Events.onMessage(event => {
                console.log('Message action', event);

                if (event.type === 'new') {
                    let message = event.data.message;

                    commit('set_message', message);

                    if (message.author !== getters.currentUser._id) {
                        commit('dialog_add_unread', message.chat);

                        let dialog = getters.dialogByChatID(message.chat);

                        if (dialog.notifications) {
                            Notifications
                                .bell()
                        }

                        if (getters.voiceRecognition) {
                            Notifications
                                .voiceMessage(getters.userCollection[message.author].username, message.content)
                        }
                    }
                }

                else if (event.type === 'update') {
                    let message = event.data.message;

                    commit('update_message', message);
                }

                else if (event.type === 'delete') {
                    let message = event.data.message;
                    let deleteFor = event.data.deleteFor;

                    if (deleteFor.indexOf(getters.currentUser._id) > -1) {
                        commit('delete_message', message);
                    }
                }

                else if (event.type === 'read') {
                    let {chatID, userID} = event.data;
                    commit('readMessages', {chatID, userID});

                    if (userID === getters.currentUser._id) {
                        commit('dialog_clear_unread', chatID);
                    }
                }
            });

            Povidom.Events.onTyping(event => {
                console.log('Chat typing action', event);

                commit('set_typing', event);
            });

            Povidom.Events.onUserActivity(event => {
                console.info('User activity', event);

                commit('update_user', event)
            });

            Povidom.Events.onError(error => {
                dispatch('Auth/logout');
                console.log('Socket error', error);
            });

            // API.interceptors.response.use(
            //     // success
            //     response => response,
            //
            //     // error
            //     error => {
            //         if (error.status === 401) {
            //             dispatch('Auth/logout');
            //             console.log('API error', error);
            //         }
            //     }
            // );
        },

        async searchUser ({}, params) {
            let users = await Povidom.Users.search(params);

            return users
        },

        async getDialog ({commit, getters}, data) {
            let dialog = await Povidom.Chats.getDialog(data);

            let {members, chats, dialogs} = normalizeDialog(dialog).entities;

            if (!getters.chatCollection[dialog.chat._id]) {
                commit('set_chats_many', chats);
                commit('set_dialogs_many', dialogs);
                commit('set_users_many', members);

                Povidom.Events.subscribe('chats', getters.chats.map(chat => chat._id));
                Povidom.Events.subscribe('users', getters.users.map(user => user._id));
            }

            commit('set_currentChat', dialog.chat._id)
        },

        async createGroup ({commit}, data) {
            await Povidom.Chats.createGroup(data)
        },

        async sendMessage ({commit, getters}, message) {
            await Povidom.Messages.sendMessage(message);
        },

        async editMessage ({commit, getters}, message) {
            await Povidom.Messages.updateMessage(message);
        },

        async deleteMessage ({commit}, message) {
            await Povidom.Messages.deleteMessage(message);
        },

        async readMessages ({commit}, chatID) {
            await Povidom.Messages.readMessages(chatID);
        },

        async getChatMessages ({commit}, params) {
            let messages = await Povidom.Messages.getMessages(params);

            commit('set_messages_many', messages.toSet());

            if (messages.length) {
                commit('add_messages_to_dialog', {messages: messages.map(m => m._id), chatID: params.chatID});
            } else {
                commit('dialog_allLoaded', {chatID: params.chatID})
            }
        },

        async preloadChatMessages ({commit}, params) {
            let messages = await Povidom.Messages.getMessages(params);

            commit('set_messages_many', messages.toSet());
            commit('set_dialog_preload', params.chatID);

            if (messages.length) {
                commit('add_messages_to_dialog', {messages: messages.map(m => m._id), chatID: params.chatID});
            }
        },

        async chatClearHistory ({commit}, chatID) {
            await Povidom.Chats.clearHistory(chatID);
        },

        async deleteChat ({commit}, chatID) {
            await Povidom.Chats.deleteDialog(chatID);

            commit('set_currentChat', null)
        },

        async toggleNotifications ({commit, getters}, chatID) {
            let dialog = getters.dialogByChatID(chatID);
            let data;

            if (dialog.notifications) {
                data = {chatID, value: false};

                await Povidom.Chats.setNotifications(data);
                commit('dialog_set_notifications', data)
            } else {
                data = {chatID, value: true};

                await Povidom.Chats.setNotifications(data);
                commit('dialog_set_notifications', data)
            }
        },

        async setAvatar ({commit, getters}, avatar) {
            await Povidom.Users.setAvatar({avatar})
        },

        typingAction ({}, action) {
            Povidom.Events.typing(action)
        },

        close ({state, commit}) {
            if (Object.values(state.modals).indexOf(true) > -1) {
                commit('set_modal', {name: 'users', value: false});
                commit('set_modal', {name: 'newGroup', value: false});
                commit('set_modal', {name: 'settings', value: false});
            }
            else if (state.deleteMessage) commit('set_deleteMessage', null);
            else if (state.editMessage) commit('set_editMessage', null);
            else if (state.currentChat) commit('set_currentChat', null)
        },
    },
    strict: process.env.NODE_ENV !== 'production'
})
