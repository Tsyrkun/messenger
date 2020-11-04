<template>
    <Scroller
            :items="messages"
            @update="onScroll"
            @scrollDown="onScrollDown"
            @scrollUp="onScrollUp"
            ref="messages"
            :loading="loading"
    >
        <template v-for="(item, index) in stack">
            <ChatDateLabel
                    v-if="item.type==='serviceDate'"
                    :date='item.data.date'
                    :id="'service' + index"
            />

            <ChatMessage
                    v-if="item.type==='message'"
                    :joined="item.joined"
                    :message="item.data"
                    :key="index"
                    :id="item.data._id"
            />

            <ChatUnreadLabel
                    v-if="item.type==='serviceUnread'"
            />

        </template>

        <div id="bottom"></div>

        <ChatDeleteMessage />
    </Scroller>
</template>

<script>
    import ChatMessage from '../components/ChatMessage'
    import ChatDateLabel from '../components/ChatDateLabel'
    import ChatUnreadLabel from '../components/ChatUnreadLabel'
    import ChatDeleteMessage from '../components/ChatDeleteMessage'

    import {EventBus} from '../EventBus'

    export default {
        name: "ChatMessages",
        components: {
            ChatMessage, ChatDateLabel, ChatUnreadLabel, ChatDeleteMessage
        },
        data () {
            return {
                loading: false,
                offsetBottom: 0,
                loadPreviousMessages: false,

            }
        },
        watch: {
            messages () {
                if (this.offsetBottom < 200) {
                    this.scrollToLast();
                }
            },
            scrolledToLast (v) {
                  if (v) EventBus.$emit('chat_scroll_hide')
            },
            chatID: {
                handler () {
                    if (!this.preloaded) {
                        this.preloadMessages()
                    }

                    if (this.dialog.scrolled) {
                        this.scrollOn(this.dialog.scrolled)
                    }
                },
                immediate: true
            },
        },
        mounted () {
            EventBus.$on('chat_scroll_to_last', () => {
                this.scrollToLast();
            });

            // if (!this.preloaded) {
            //     this.preloadMessages()
            // }
            //
            // if (this.dialog.scrolled) {
            //     this.scrollOn(this.dialog.scrolled)
            // }

        },
        computed: {
            scrolledToLast () {
              return !this.offsetBottom
            },
            currentUser () {
                return this.$store.getters['currentUser']
            },

            chatID () {
                return this.$store.getters.currentChat
            },

            chat () {
                return this.$store.getters['chatByID'](this.chatID) || {}
            },

            dialog () {
                return this.$store.getters['dialogByChatID'](this.chatID)
            },

            messages () {
                return this.$store.getters['dialogMessages'](this.dialog._id)
            },

            readMessages () {
                return this.messages.filter(message => message.read)
            },

            private () {
                return this.chat.type === 'private'
            },

            group () {
                return this.chat.type === 'group'
            },

            preloaded () {
                return this.dialog.preload
            },

            unreadMessages () {
                return this.messages.filter(message => !message.read && message.author !== this.currentUser._id)
            },

            stack () {
                return this.messages.reduce((total, current, index, messages) => {

                    let previous = messages[index - 1];
                    let next = messages[index + 1];

                    let serviceUnread = {type: 'serviceUnread'};
                    let serviceDate = {type: 'serviceDate', data: {date: current.createdAt}};

                    let message = {type: 'message', data: current, joined: false};

                    if (!index) {

                        if (next && next.author === current.author) {
                            message.joined = true
                        }

                        return [serviceDate, message]
                    } else {

                        let previousDate = new Date(previous.createdAt).setHours(0, 0, 0, 0);
                        let currentDate = new Date(current.createdAt).setHours(0, 0, 0, 0);

                        let result = [];

                        if (next && next.author === current.author) {
                            message.joined = true
                        }

                        if (previousDate !== currentDate) {
                            result = [serviceDate, message]
                        } else if (!current.read && current.author !== this.currentUser._id) {
                            if (!previous.read && previous.author !== this.currentUser._id) {
                                result = [message]
                            } else {
                                result = [serviceUnread, message]
                            }
                        } else {
                            result = [message]
                        }

                        return [...total, ...result]
                    }
                }, []);
            }
        },
        methods: {
            scrollTo (messageID) {
                let element = document.getElementById(messageID);

                if (element) {
                    setTimeout(() => element.scrollIntoView({block: "end", behavior: "instant"}), 50)
                }
            },

            scrollOn (fromTop) {
                if (this.$refs.messages) {
                    this.$refs.messages.$refs.scroller.scrollTop = fromTop
                }
            },

            scrollToLast () {
                let element = document.getElementById("bottom");

                if (element) {
                    setTimeout(() => element.scrollIntoView({block: "end", behavior: "smooth"}), 5)
                }
            },

            scrollToBottom () {
                let element = document.getElementById("bottom");

                if (element) {
                    setTimeout(() => element.scrollIntoView({block: "end", behavior: "smooth"}), 50)
                }
            },

            onScroll (data) {
                if (data.total === 0) this.loadMoreMessages();

                this.offsetBottom = data.fromBottom;

                this.$store.commit('dialog_set_scroll', {chatID: this.chatID, scrolled: data.fromTop})
            },

            onScrollDown () {
                EventBus.$emit('chat_scroll_show');
            },

            onScrollUp () {
                EventBus.$emit('chat_scroll_hide');
            },

            async preloadMessages () {
                console.log('preload messages');
                this.loading = true;
                try {
                    await this.$store.dispatch('preloadChatMessages', {
                        chatID: this.chatID
                    });

                    this.scrollToLast()

                } catch (e) {
                    console.log(e);
                }
                this.loading = false;
            },

            async loadMoreMessages () {
                console.log('load more messages');

                let topMessageID = this.messages[0]._id;

                if (!this.dialog.loadedAll) {
                    this.loading = true;

                    try {
                        await this.$store.dispatch('getChatMessages', {
                            chatID: this.chatID,
                            skip: this.messages.length
                        });

                        this.scrollTo(topMessageID)
                    } catch (e) {
                        console.log(e);
                    }

                    this.loading = false;
                } else {
                    console.log('loaded all messages');
                }
            }
        }
    }
</script>

<style>

</style>