<template>
    <v-layout align-end style="max-height: 300px" id="chatNewMessageArea">
        <v-textarea
                ref="textField"
                rows="1"
                auto-grow
                autofocus
                full-width
                hide-details
                placeholder="Write your message here..."
                v-model="message"
                @keydown="onTyping"
                @keyup.enter="sendMessage"
                @focus="readMessages"
        />
        <v-btn icon flat color="blue" @click="sendMessage">
            <v-icon>send</v-icon>
        </v-btn>
    </v-layout>
</template>

<script>
    import {EventBus} from "../EventBus";

    export default {
        name: "ChatNewMessageArea",
        data: ()=>({
            message: '',
            isTyping: false,
            timer: null
        }),
        watch: {
            messages () {
                if (this.focused()) {
                    this.readMessages()
                }
            },

            chatID () {
                this.focus()
            }
        },
        mounted () {
            this.preventDefault()
        },
        computed: {
            currentUser () {
                return this.$store.getters['currentUser'];
            },

            chatID () {
                return this.$store.getters.currentChat
            },

            dialog () {
                return this.$store.getters['dialogByChatID'](this.chatID)
            },

            messages () {
                return this.$store.getters['dialogMessages'](this.dialog._id)
            }
        },
        methods: {
            focused () {
                return this.$refs.textField.$refs.input === document.activeElement
            },

            focus () {
                return this.$refs.textField.$refs.input.focus()
            },

            preventDefault () {
                this.$refs.textField.$refs.input.addEventListener('keydown', (e) => {
                    if (event.keyCode === 13) {
                        e.preventDefault();
                        e.target.value = null;

                        setTimeout(() => {
                            this.$refs.textField.calculateInputHeight();
                        }, 10)
                    }
                });
            },

            async sendMessage () {
                if (this.message) {
                    let message = {
                        content: this.message.replace(/\r?\n/g, ""),
                        author: this.currentUser._id,
                        chat: this.chatID,
                    };

                    await this.$store.dispatch('sendMessage', message);
                    this.message = null;
                    EventBus.$emit('chat_scroll_to_last');

                    this.$refs.textField.$refs.input.focus()
                }
            },

            readMessages () {
                if (this.dialog.unreadCount) {
                    console.log('readMessages');
                    this.$store.dispatch('readMessages', { chatID: this.chatID });
                }
            },

            typing () {
                this.isTyping = true;
                this.$store.dispatch('typingAction', {
                    typing: true,
                    userID: this.currentUser._id,
                    chatID: this.chatID
                })
            },

            notTyping () {
                this.isTyping = false;
                this.$store.dispatch('typingAction', {
                    typing: false,
                    userID: this.currentUser._id,
                    chatID: this.chatID
                })
            },

            onTyping (e) {
                if ([8, 13, 17, 18, 27].indexOf(e.keyCode) === -1) {
                    if (!this.isTyping) {
                        this.typing();
                    } else {
                        clearTimeout(this.timer);
                    }

                    this.timer = setTimeout(this.notTyping, 1000)
                }
            },
        }
    }
</script>

<style lang="stylus">
    #chatNewMessageArea .v-input__control {
        font-size: 14px;
        padding 8px 0
    }

    #chatNewMessageArea textarea {
        max-height: 200px
        overflow-y: auto
    }

    #chatNewMessageArea textarea::-webkit-scrollbar {
        display: none;
    }
</style>