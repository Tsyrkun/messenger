<template>
    <v-dialog v-model="modal" max-width="400" scrollable lazy>
        <v-card>
            <v-form ref="form" v-model="valid">
                <v-card-title class="py-2">
                    <div class="title">Create group</div>

                    <v-spacer />

                    <v-btn icon @click="close">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-card-title>

                <div class="px-3 pb-2">
                    <v-text-field ref="title" v-model="title" prepend-icon="title" placeholder="Title" :rules="[required]" />
                </div>

                <v-divider></v-divider>

                <v-card-text class="py-0 pb-2" style="height: auto;">
                    <v-autocomplete
                            v-model="members"
                            hide-no-data
                            chips
                            ref="search"
                            prepend-icon="group"
                            color="blue-grey lighten-2"
                            placeholder="Members"
                            item-text="name"
                            item-value="name"
                            multiple
                            append-icon=""
                            @keyup="searchUserDelayed"
                            :rules="[membersRequired]"
                    >
                        <template
                                slot="selection"
                                slot-scope="data"
                        >
                            <v-chip
                                    :selected="data.selected"
                                    close
                                    class="chip--select-multi"
                                    @input="removeMember(data.item)"
                            >
                                <Avatar size="40" :title="data.item.username" :avatar="data.item.avatar"
                                        :palette="data.item.palette" />
                                {{ data.item.username }}
                            </v-chip>
                        </template>
                    </v-autocomplete>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-text class="pa-0" style="height: auto; min-height: 250px">
                    <v-layout fill-height align-center justify-center v-if="loading || noMath">
                        <v-progress-circular
                                v-if="loading"
                                :size="50"
                                color="primary"
                                indeterminate
                        ></v-progress-circular>

                        <v-chip v-if="noMath" outline disabled>No users were found</v-chip>
                    </v-layout>

                    <v-list dense two-line v-else>
                        <v-list-tile ripple @click="addMember(user)" v-for="user in users" :key="user._id">
                            <v-list-tile-action>
                                <Avatar size="40" :title="user.username" :avatar="user.avatar"
                                        :palette="user.palette" />
                            </v-list-tile-action>

                            <v-list-tile-content>
                                <v-list-tile-title><strong>{{ user.username }}</strong></v-list-tile-title>
                                <v-list-tile-sub-title>{{ user.lastActivity | lastSeen }}</v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer />
                    <v-btn color="blue" flat @click="createGroup" :loading="loading" :disabled="!valid">create</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>

    </v-dialog>
</template>

<script>
    import DateFilters from '../filters/date'
    import Lodash from 'lodash'

    export default {
        name: "NewGroup",
        props: ['show'],
        mixins: [DateFilters],
        watch: {
            members (v) {
                let select = this.$refs.search;
                select.$nextTick(() => select.$data.selectedItems = v);
            },

            modal () {
                this.focus()
            }
        },
        data: () => ({
            title: null,
            members: [],
            valid: false,
            loading: false,
            noMath: false,
            users: []
        }),
        computed: {
            modal: {
                get () {
                    return this.$store.getters.modals.newGroup
                },
                set () {
                    this.close()
                }
            },

            searchUserDelayed () {
                return Lodash.debounce(this.searchUser, 500)
            },

            currentUser () {
                return this.$store.getters.currentUser
            },

            required () {
                return v => !!v || 'This field is required'
            },

            membersRequired () {
                return v => !!v.length || 'At least one member required'
            },

        },
        methods: {
            focus () {
                setTimeout(() => this.$refs.title.$refs.input.focus(), 10)
            },

            close () {
                this.$emit('close');
                this.$store.commit('set_modal', {name: 'newGroup', value: false});
                this.clear();
            },

            clear () {
                this.users = [];
                this.title = null;
                this.noMath = false;
                this.loading = false;


                let select = this.$refs.search;
                select.$nextTick(() => select.$data.selectedItems = []);

                this.$refs.form.reset()
            },

            addMember (user) {
                const index = this.members.findIndex(member => user._id === member._id);
                if (index === -1) this.members.push(user);

                this.users = [];

                setTimeout(() => this.$refs.search.focus(), 10)
            },

            removeMember (user) {
                const index = this.members.findIndex(member => user._id === member._id);
                if (index >= 0) this.members.splice(index, 1)
            },

            async searchUser () {
                let search = this.$refs.search.lazySearch;

                if (!!search && search.length > 3) {
                    this.loading = true;
                    this.users = await this.$store.dispatch('searchUser', {search: search});
                    this.noMath = !this.users.length;
                    this.loading = false;
                }
            },

            async createGroup () {
                let members = this.members.map(member => member._id);
                members.push(this.currentUser._id);

                await this.$store.dispatch('createGroup', {
                    title: this.title,
                    members: members
                });

                this.close()
            }
        }
    }
</script>