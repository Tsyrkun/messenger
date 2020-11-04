<template>
    <v-layout column id="chatEditMessageArea">
        <v-flex layout class="py-2 pl-2 divider">
            <v-icon color="blue">edit</v-icon>
            <div class="pl-2">
                <div><strong>Edit message</strong></div>
                <div class="caption text-clamp-3">{{editMessage}}</div>
            </div>

            <v-spacer />

            <v-btn icon flat color="red" @click="closeEdit">
                <v-icon>close</v-icon>
            </v-btn>
        </v-flex>

        <v-flex layout align-end>
            <v-textarea
                    ref="textField"
                    rows="1"
                    auto-grow
                    autofocus
                    full-width
                    hide-details
                    placeholder="Edit your message here..."
                    v-model="message"
                    @keyup.enter="send"
            />
            <v-btn icon flat color="blue" @click="send">
                <v-icon>check</v-icon>
            </v-btn>
        </v-flex>

    </v-layout>
</template>

<script>
    export default {
        name: "ChatEditMessageArea",
        data: () => ({
            editMessage: '',
            message: ''
        }),
        mounted () {
            this.preventDefault();

            this.message = this.editMessage = Object.assign({}, this.editMessageData).content
        },
        computed: {
            editMessageID () {
                return this.$store.getters.editMessage
            },

            editMessageData () {
                return this.$store.getters['messageByID'](this.editMessageID)
            }
        },
        methods: {
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

            async send () {
                if (this.message.length) {
                    let message = Object.assign({}, this.editMessageData);
                    message.content = this.message;

                    await this.$store.dispatch('editMessage', message);
                    this.closeEdit()
                }
            },

            closeEdit () {
                this.$store.commit('set_editMessage', null)
            }
        }
    }
</script>

<style lang="stylus">
    #chatEditMessageArea .v-list__tile__action {
        min-width: 30px
    }

    #chatEditMessageArea .v-input__control {
        font-size: 14px;
        padding 8px 0
    }

    #chatEditMessageArea textarea {
        max-height: 200px
        overflow-y: auto
    }

    #chatEditMessageArea textarea::-webkit-scrollbar {
        display: none;
    }
</style>