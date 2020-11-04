import { normalize, schema } from 'normalizr';

const messageSchema = new schema.Entity('messages', {}, {
    idAttribute: '_id'
});

const memberSchema = new schema.Entity('members', {}, {
    idAttribute: '_id'
});

const chatSchema = new schema.Entity('chats', {
    members: [memberSchema]
}, {
    idAttribute: '_id'
});

const dialogSchema = new schema.Entity('dialogs', {
    messages: [messageSchema],
    chat: chatSchema
}, {
    idAttribute: '_id'
});

const chatListSchema = [ chatSchema ];

const userSchema = new schema.Entity('user', {
    dialogs: [dialogSchema]
}, {
    idAttribute: '_id'
});

const newPrivateChatResponse = new schema.Entity('user', {
    dialogs: [dialogSchema],
    chats: [chatSchema],
    users: [memberSchema],
}, {
    idAttribute: '_id'
});

const memberListSchema = [ memberSchema ];

const messageListSchema = [ messageSchema ];

export function normalizeSchema (type, entry) {

    if (type === 'chatList') {
        return normalize(entry, chatListSchema);
    }

    else if (type === 'user') {
        return normalize(entry, userSchema);
    }

    else if (type === 'messageList') {
        return normalize(entry, messageListSchema);
    }

    else if (type === 'memberList') {
        return normalize(entry, memberListSchema);
    }

    else if (type === 'newPrivateChat') {
        return normalize(entry, newPrivateChatResponse);
    }

    else {
        return { entities: {}, results: {} }
    }
}

export function normalizeDialog (entry) {
    return normalize(entry, dialogSchema);
}

export function normalizeUser (entry) {
    return normalize(entry, userSchema);
}