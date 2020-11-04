<template>
    <Wrapper>
        <v-toolbar height="56" flat color="white" style="z-index: 1" class="divider">
            <v-btn icon @click="toggleNavigation">
                <v-icon>menu</v-icon>
            </v-btn>

            <v-flex id="chatListSearch">
                <v-text-field backgroundColor="grey lighten-3" v-model="search" flat solo hide-details placeholder="Search" clearable />
            </v-flex>
        </v-toolbar>

        <Scroller :items="dialogsCompleteFiltered" height="100%">
            <v-layout fill-height align-center justify-center v-if="!dialogsComplete.length">
                <v-chip color="blue" text-color="white" disabled class="list-info">
                    <div>
                        <span>To start chat go to menu </span>
                        <v-icon class="mx-2">menu</v-icon>
                        <br>
                        <span> and navigate to users tab</span>
                    </div>
                </v-chip>
            </v-layout>

            <v-list dense two-line v-else>
                <ChatListItem v-for="dialogID in dialogsCompleteFiltered" :dialogID="dialogID" :key="dialogID" />
            </v-list>
        </Scroller>
    </Wrapper>
</template>

<script>
    import ChatListItem from './ChatListItem'
    import Lodash from 'lodash'

    export default {
        name: "ChatList",
        components: {
            ChatListItem
        },
        data: () => ({
            search: ''
        }),
        computed: {
            dialogs () {
                return this.$store.getters.dialogs
            },

            userCollection () {
                return this.$store.getters.userCollection
            },

            chatCollection () {
                return this.$store.getters.chatCollection
            },

            dialogsComplete () {
                let dialogs = Lodash.map(this.dialogs, Lodash.clone);

                dialogs = dialogs.filter(dialog => dialog.active);

                dialogs.map(dialog => {
                    if (dialog.companion) {
                        dialog.companion = this.userCollection[dialog.companion];
                    }
                    dialog.chat = this.chatCollection[dialog.chat]
                });

                return dialogs;
            },

            dialogsCompleteFiltered () {
                const search = new RegExp(this.search, 'i');

                let dialogs = this.dialogsComplete;

                if (this.search) {
                    return dialogs.filter(dialog => {
                        if (dialog.chat.type === 'private') {
                            return search.test(dialog.companion.username)
                        } else if (dialog.chat.type === 'group') {
                            return search.test(dialog.chat.title)
                        }
                    }).map( dialog => dialog._id)
                } else {
                    return dialogs.map( dialog => dialog._id)
                }
            }
        },
        methods: {
            toggleNavigation () {
                this.$emit('toggleNavigation')
            },

            toChat () {
                this.$router.push('/chat')
            }
        }
    }
</script>

<style>
    #chatListSearch .v-text-field.v-text-field--solo .v-input__control {
        min-height: 36px;
        font-size: 14px;
    }

    .list-info .v-chip__content {
        height: 50px!important;
    }

    .list-info div {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }
</style>