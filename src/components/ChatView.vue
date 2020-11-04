<template>
    <Wrapper img >
       <template v-if="chatID">
           <ChatToolbar />

           <ChatMessages />

           <ChatTextarea />
       </template>

        <template v-else>
            <v-layout fill-height align-center justify-center>
                <v-chip disabled small>
                    <div class="black--text">Please select a chat to start messaging</div>
                </v-chip>
            </v-layout>
        </template>
    </Wrapper>
</template>

<script>
    import ChatToolbar from './ChatToolbar'
    import ChatTextarea from './ChatTextarea'
    import ChatMessages from './ChatMessages'

    export default {
        name: "ChatView",
        components: {
            ChatToolbar, ChatTextarea, ChatMessages
        },
        computed: {
            chatID () {
                return this.$store.getters.currentChat
            }
        },
        methods: {

        }
    }
</script>

<style>
    .v-responsive__sizer{
        padding: 0!important;
    }
</style>