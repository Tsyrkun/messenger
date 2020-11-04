<template>
    <v-dialog v-model="modal" max-width="350" lazy scrollable>
        <v-card>
            <v-card-title class="py-2">
                <div class="title">Users</div>

                <v-spacer />

                <v-btn icon @click="close">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-card-title>

            <div class="px-3">
                <v-text-field ref="search" autofocus v-model="search" prepend-icon="search" placeholder="Search" clearable />
            </div>

            <v-divider></v-divider>

            <v-card-text class="pa-0" style="height: 300px; min-height: 350px">
                <v-layout fill-height align-center justify-center v-if="loading || noMatch">
                    <v-progress-circular
                            v-if="loading"
                            :size="50"
                            color="primary"
                            indeterminate
                    ></v-progress-circular>

                    <v-chip v-else-if="noMatch" outline disabled>No users were found</v-chip>
                </v-layout>

                <v-list dense two-line v-else>
                    <v-list-tile :disabled="pending" ripple @click="getDialog(user._id)" v-for="user in users" :key="user._id">
                        <v-list-tile-action>
                            <Avatar size="40" :title="user.username" :avatar="user.avatar" :palette="user.palette" />
                        </v-list-tile-action>

                        <v-list-tile-content>
                            <v-list-tile-title><strong>{{ user.username }}</strong></v-list-tile-title>
                            <v-list-tile-sub-title>{{ user.lastActivity | lastSeen }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    import DateFilters from '../filters/date'
    import Lodash from 'lodash'

    export default {
        name: "Users",
        props: ['show'],
        mixins: [DateFilters],
        watch: {
            search (v) {
                if (!!v && v.length > 3) this.searchUserDelayed();
                if (!v) this.clear()
            },

            modal () {
                this.focus()
            }
        },
        data: ()=>({
            search: null,
            loading: false,
            pending: false,
            noMatch: false,
            users: []

        }),
        mounted () {

          this.search = ''

        },
        computed: {
            modal: {
                get () {
                    return this.$store.getters.modals.users
                },
                set () {
                    this.close()
                }
            },

            searchUserDelayed () {
                return Lodash.debounce(this.searchUser, 500)
            },

            mobile () {
                return this.$store.getters.mobile
            }
        },
        methods: {
            focus () {
                setTimeout(() => this.$refs.search.$refs.input.focus(), 10)
            },

            close () {
                this.$emit('close');
                this.$store.commit('set_modal', {name: 'users', value: false});
                this.clear();
            },

            clear () {
                this.users = [];
                this.search = null;
                this.noMatch = false;
                this.loading = false;
                this.pending = false
            },

            async getDialog (userID) {
                this.pending = true;
                await this.$store.dispatch('getDialog', {userID});
                this.pending = false;
                this.close()
            },

            async searchUser () {
                if (!!this.search && this.search.length > 3) {
                    this.loading = true;
                    this.users = await this.$store.dispatch('searchUser', {search: this.search});
                    this.noMatch = !this.users.length;
                    this.loading = false;
                }
            }
        }
    }
</script>

<style scoped>

</style>