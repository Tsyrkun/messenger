<template>
    <v-list-tile avatar ripple @click="setCurrentChat" :class="active && !mobile ? 'blue lighten-1' : ''" :dark="active && !mobile">
        <v-list-tile-avatar>
            <Avatar size="48" :title="title" :avatar="avatar" :online="companion ? companion.online : false" :palette="companion ? companion.palette : 0"/>
        </v-list-tile-avatar>

        <v-list-tile-content>
            <v-list-tile-title>
                <v-icon small v-if="group">group</v-icon>
                <strong :class="active && !mobile ? 'white--text' : ''" >{{title}}</strong>
            </v-list-tile-title>

            <v-list-tile-sub-title v-if="companionTyping">
                <v-progress-circular :width="2" :size="14" :indeterminate="true" :color="active && !mobile ? 'white' : 'blue'"></v-progress-circular>
                <strong :class="[active && !mobile ? 'white--text' : '', 'ml-2']" >typing</strong>
            </v-list-tile-sub-title>

            <v-list-tile-sub-title v-else-if="group && typingMembersCount">
                <v-progress-circular :width="2" :size="14" :indeterminate="true" :color="active && !mobile ? 'white' : 'blue'"></v-progress-circular>
                <strong :class="[active && !mobile ? 'white--text' : '', 'ml-2']" > {{typingMembersCount}} typing</strong>
            </v-list-tile-sub-title>

            <v-list-tile-sub-title v-else-if="lastMessage" :class="active && !mobile ? 'white--text' : ''" >{{ lastMessage.content }}</v-list-tile-sub-title>
        </v-list-tile-content>

        <v-list-tile-action>
            <v-list-tile-action-text v-if="lastMessage" :class="active && !mobile ? 'white--text' : ''">
                <v-icon :color="active && !mobile ? 'white' : 'blue'" small>{{ lastMessage.read ? 'done_all' : 'check'}}</v-icon>
                {{ lastMessage.createdAt | shortTime}}
            </v-list-tile-action-text>

            <v-avatar :color="active && !mobile ? 'white' : 'blue'" size="20" v-if="unreadMessages">
                <span :class="[active && !mobile ? '' : 'white--text', 'caption']">{{ unreadMessages }}</span>
            </v-avatar>

            <div v-else></div>
        </v-list-tile-action>
    </v-list-tile>
</template>

<script>
    import DateFilters from '../filters/date'

    export default {
        props: ['dialogID'],
        data: () => ({}),
        mixins: [DateFilters],
        computed: {
            dialog () {
                return this.$store.getters['dialogByID'](this.dialogID)
            },

            chat () {
                return this.$store.getters['chatByID'](this.dialog.chat)
            },

            currentChat () {
                return this.$store.getters['currentChat']
            },

            lastMessageID () {
                return this.dialog.messages.last()
            },

            lastMessage () {
                return this.$store.getters['messageByID'](this.lastMessageID)
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

            typingMembers () {
                return this.$store.getters['typing'](this.chat._id)
            },

            typingMembersCount () {
                return this.typingMembers
                    ? Object.keys(this.typingMembers).length
                    : 0
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

            unreadMessages () {
                return this.dialog.unreadCount
            },

            mobile () {
                return this.$store.getters.mobile
            },

            active () {
                return this.chat._id === this.currentChat
            }
        },
        methods: {
            setCurrentChat () {
                this.$store.commit('set_currentChat', this.chat._id);
            }
        }
    }
</script>