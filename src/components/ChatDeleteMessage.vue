<template>
    <v-dialog v-model="modal" width="300">
        <v-card>
            <v-card-text>
                <div>Do you want to delete this message?</div>
                <div v-if="!my" class="mt-2">This will delete it just for you.</div>

                <v-checkbox :value="companion._id" v-model="deleteFor" v-else-if="companion" hideDetails :label="'Delete for ' + companion.username"></v-checkbox>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                        color="primary"
                        flat
                        @click="close"
                >
                   cancel
                </v-btn>

                <v-btn
                        color="primary"
                        flat
                        @click="deleteMessage"
                >
                    delete
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: "ChatDeleteMessage",
        data: ()=>({
            deleteFor: []
        }),
        methods: {
            close () {
                this.$store.commit('set_deleteMessage', null)
            },

            async deleteMessage () {
                await this.$store.dispatch('deleteMessage', {
                    _id: this.deleteMessageData._id,
                    chat: this.deleteMessageData.chat,
                    author: this.deleteMessageData.author,
                    deleteFor: [...this.deleteFor, this.currentUser._id]
                });

                this.close()
            }
        },
        computed: {
            modal: {
                get () {
                    return !!this.deleteMessageID
                },
                set () {
                    this.close()
                }
            },

            currentUser () {
                return this.$store.getters['currentUser']
            },

            my () {
                return this.deleteMessageID
                    ? this.currentUser._id === this.deleteMessageData.author
                    : false
            },

            deleteMessageID () {
                return this.$store.getters.deleteMessage
            },

            deleteMessageData () {
                return this.$store.getters['messageByID'](this.deleteMessageID)
            },

            chat () {
                return this.deleteMessageData ?
                    this.$store.getters.chatByID(this.deleteMessageData.chat)
                    : {}
            },

            dialog () {
                return this.deleteMessageData ?
                    this.$store.getters.dialogByChatID(this.deleteMessageData.chat)
                    : {}
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
            }
        }
    }
</script>

<style scoped>

</style>