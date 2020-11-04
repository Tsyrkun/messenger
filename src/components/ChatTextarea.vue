<template>
    <v-card flat tile class="divider-top">
        <ChatNewMessageArea v-if="!editMessage" />
        <ChatEditMessageArea v-else />

        <transition name="scale-transition">
            <v-btn
                    v-if="scroll"
                    absolute
                    dark
                    fab
                    top
                    right
                    small
                    style="top: -60px"
                    color="blue"
                    @click="scrollToLast"
            >
                <v-icon>keyboard_arrow_down</v-icon>
            </v-btn>
        </transition>
    </v-card>
</template>

<script>
    import ChatNewMessageArea from './ChatNewMessageArea'
    import ChatEditMessageArea from './ChatEditMessageArea'

    import {EventBus} from '../EventBus'

    export default {
        name: "ChatTextarea",
        components: {
            ChatNewMessageArea, ChatEditMessageArea
        },
        data: () => ({
            scroll: false
        }),
        mounted () {
            EventBus.$on('chat_scroll_show', () => {
                if (!this.scroll) this.scroll = true
            });
            EventBus.$on('chat_scroll_hide', () => this.scroll = false);
        },
        methods: {
            scrollToLast () {
                EventBus.$emit('chat_scroll_to_last')
            }
        },
        computed: {
            editMessage () {
                return this.$store.getters.editMessage
            }
        }
    }
</script>