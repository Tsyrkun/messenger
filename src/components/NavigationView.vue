<template>
    <div>
        <v-img :aspect-ratio="16/9"
               src="https://www.wallpaperflare.com/static/275/847/639/bridge-railway-tracks-tracks-railway-wallpaper-preview.jpg">
            <v-layout pa-4 column fill-height class="lightbox white--text">
                <v-flex shrink>
                    <Avatar size="70" :title="currentUser.username" :avatar="currentUser.avatar" :palette="currentUser.palette" />
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex shrink>
                    <div class="subheading">{{currentUser.username}}</div>
                    <!--<div class="body-1">heyfromjonathan@gmail.com</div>-->
                </v-flex>
            </v-layout>
        </v-img>

        <v-list dense two-line id="nav-list">
            <v-list-tile v-for="item in items" :key="item.title"  @click="open(item.name)" ripple>
                <v-list-tile-action>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-title><strong>{{ item.title }}</strong></v-list-tile-title>
            </v-list-tile>

            <!--<v-list-tile ripple>-->
                <!--<v-list-tile-action>-->
                    <!--<v-icon>brightness_2</v-icon>-->
                <!--</v-list-tile-action>-->
                <!--<v-list-tile-title><strong>Dark Theme</strong></v-list-tile-title>-->
            <!--</v-list-tile>-->

            <v-list-tile ripple @click="logout">
                <v-list-tile-action>
                    <v-icon>exit_to_app</v-icon>
                </v-list-tile-action>
                <v-list-tile-title><strong>Log Out</strong></v-list-tile-title>
            </v-list-tile>
        </v-list>
    </div>
</template>

<script>
    import Avatar from '../components/Avatar'

    export default {
        name: "NavigationView",
        components: {
            Avatar
        },
        data: () => ({
            items: [
                {icon: 'group', title: 'New Group', name: 'newGroup'},
                {icon: 'person', title: 'Users', name: 'users'},
                {icon: 'settings', title: 'Settings', name: 'settings'}
            ]
        }),
        methods: {
            open (name) {
                this.$store.commit('set_modal', {name, value: true});
                this.$emit('open', name)
            },
            logout () {
                this.$store.dispatch('Auth/logout')
            }
        },
        computed: {
            currentUser () {
                return this.$store.getters['currentUser']
            }
        }
    }
</script>

<style>
    #nav-list.v-list--two-line.v-list--dense .v-list__tile {
        height: 48px;
    }
</style>