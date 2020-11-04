<template>
    <v-toolbar height="56" flat color="white" class="divider">
        <v-btn icon v-if="mobile" @click="closeChat">
            <v-icon>keyboard_arrow_left</v-icon>
        </v-btn>

        <v-list dense class="pa-0">
            <v-list-tile @click="" inactive class="clickable">
                <v-list-tile-action>
                    <Avatar size="40" :title="title" :avatar="avatar" :palette="companion ? companion.palette : 0" />
                </v-list-tile-action>

                <v-list-tile-content>
                    <v-list-tile-title>
                        <v-icon class="mr-1" small v-if="group">group</v-icon>
                        <strong>{{ title }}</strong>
                    </v-list-tile-title>

                    <template v-if="private">
                        <v-list-tile-sub-title v-if="companionTyping">
                            <div style="display: flex; align-items: center">
                                <v-progress-circular :width="2" :size="14" :indeterminate="true"
                                                     color="green"></v-progress-circular>
                                <strong class="ml-2">typing</strong>
                            </div>
                        </v-list-tile-sub-title>

                        <v-list-tile-sub-title v-else-if="companionOnline">
                            <strong class="blue--text">Online</strong>
                        </v-list-tile-sub-title>
                        <v-list-tile-sub-title v-else-if="private">{{ companionLastSeen }}</v-list-tile-sub-title>
                    </template>

                    <template v-if="group">
                        <v-list-tile-sub-title>
                            <strong class="blue--text" v-if="chatMembersOnline.length">{{chatMembersOnline.length}} online</strong>
                        </v-list-tile-sub-title>
                    </template>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>

        <v-spacer />

        <v-btn
                icon
                flat
                :color="dialog.notifications ? 'blue' : 'red'"
                @click="toggleNotifications"
        >
            <v-icon v-if="dialog.notifications">notifications</v-icon>
            <v-icon v-else>notifications_off</v-icon>
        </v-btn>

        <v-menu bottom left>
            <v-btn
                    slot="activator"
                    icon
            >
                <v-icon>more_vert</v-icon>
            </v-btn>

            <v-list dense>
                <v-list-tile
                        v-for="(item, i) in chatActions"
                        :key="i"
                        @click="item.todo.call(this)"
                >
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>
    </v-toolbar>
</template>

<script>
    import DateFilters from '../filters/date'

    export default {
        name: "ChatToolbar",
        mixins: [DateFilters],
        data () {
            return {
                companionLastSeen: null,
                counter: null,
                chatActions: [
                    {title: 'Clear history', todo: this.chatClearHistory},
                    {title: 'Delete chat', todo: this.deleteChat},
                ]
            }
        },
        watch: {
            chatID: {
                handler () {
                    this.stopCounter();
                    if (this.private) this.startCounter();
                },
                immediate: true
            },
        },
        beforeDestroy () {
            this.stopCounter()
        },
        computed: {
            mobile () {
                return this.$store.getters.mobile
            },

            chatID () {
                return this.$store.getters.currentChat
            },

            chat () {
                return this.$store.getters['chatByID'](this.chatID)
            },

            dialog () {
                return this.$store.getters['dialogByChatID'](this.chatID)
            },

            private () {
                return this.chat.type === 'private'
            },

            group () {
                return this.chat.type === 'group'
            },

            companion () {
                return this.dialog.companion
                    ? this.$store.getters['userByID'](this.dialog.companion)
                    : null
            },

            companionOnline () {
                return this.companion.online
            },

            typingMembers () {
                return this.$store.getters['typing'](this.chatID)
            },

            companionTyping () {
                return this.typingMembers && this.companion
                    ? this.typingMembers[this.companion._id]
                    : false
            },

            avatar () {
                return this.private
                    ? this.companion.avatar
                    : this.chat.avatar
            },

            title () {
                return this.private
                    ? this.companion.username
                    : this.chat.title
            },

            chatMembers () {
                return this.$store.getters.chatMembers(this.chatID)
            },

            chatMembersOnline () {
                return this.chatMembers.filter(member => member.online)
            },

            unreadCountOtherChats () {
                return this.$store.getters.unreadCountOtherChats(this.chatID)
            }
        },
        methods: {
            closeChat () {
                this.$store.commit('set_currentChat', null)
            },

            startCounter () {
                this.companionLastSeen = this.$options.filters.lastSeen(this.companion.lastActivity);

                this.counter = setInterval(() => {
                    this.companionLastSeen = this.$options.filters.lastSeen(this.companion.lastActivity)
                }, 1000)
            },

            stopCounter () {
                clearInterval(this.counter);
                this.companionLastSeen = null
            },

            chatClearHistory () {
                this.$store.dispatch('chatClearHistory', this.chatID)
            },

            deleteChat () {
                this.$store.dispatch('deleteChat', this.chatID)
            },

            toggleNotifications () {
                this.$store.dispatch('toggleNotifications', this.chatID)
            },
        }
    }
</script>

<style>
    .clickable {
        cursor: pointer;
        user-select: none;
    }
</style>