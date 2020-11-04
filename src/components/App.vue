<template>
    <v-app>
        <v-navigation-drawer
                fixed
                temporary
                v-model="drawer"
                app
        >
            <NavigationView @open="openModal" />
        </v-navigation-drawer>

        <v-snackbar
                color="blue"
                bottom
                right
                :timeout="600000000"
                :value="!connected"
        >
            <div style="display: flex; width: 100%; align-items: center">
                <v-icon color="white">warning</v-icon>
                <div class="mx-2">Connecting</div>
                <v-spacer />
                <v-progress-circular
                        :size="18"
                        :width="2"
                        indeterminate
                        color="white"
                ></v-progress-circular>
            </div>
        </v-snackbar>

        <v-content>
            <v-layout fill-height>
                <transition name="fade-transition" mode="out-in">
                    <multipane class="vertical-panes" layout="vertical" v-if="!mobile" key="1">
                        <div class="pane1">
                            <ChatList @toggleNavigation="toggleNavigation" />
                        </div>

                        <multipane-resizer style="z-index: 2; flex-shrink: 0;" />

                        <v-flex>
                            <ChatView />
                        </v-flex>

                    </multipane>

                    <ChatList v-else-if="!chatID" @toggleNavigation="toggleNavigation" key="2" />

                    <ChatView v-else key="3" />
                </transition>
            </v-layout>
        </v-content>

        <Users @close="toggleModal" key="1" />
        <NewGroup @close="toggleModal" key="2" />
        <Settings @close="toggleModal" key="3" />
    </v-app>
</template>

<script>
    import {Multipane, MultipaneResizer} from 'vue-multipane';
    import Notifications from '../notifications'
    import ChatList from '../components/ChatList';
    import ChatView from '../components/ChatView';
    import NavigationView from '../components/NavigationView';
    import Users from './Users';
    import Settings from './Settings';
    import NewGroup from './NewGroup';

    export default {
        name: "App",
        data: () => ({
            drawer: false
        }),
        watch: {
            connected: {
                handler (v) {
                    this.snackbar = !v
                },
                immediate: true
            }
        },
        components: {
            Multipane, MultipaneResizer,
            ChatList, ChatView, NavigationView,
            Users, Settings, NewGroup
        },
        created () {
            this.$store.dispatch('preload')
        },
        mounted () {
            this.checkInnerWidth();

            document.addEventListener('keyup', e => {
                if (e.keyCode === 27) {
                    this.$store.dispatch('close')
                }
            }, false);

            window.addEventListener('resize', e => {
                let innerWidth = e.target.innerWidth;

                if (!this.mobile && innerWidth < 600) {
                    this.$store.commit('set_mobile', true)
                } else if (this.mobile && innerWidth >= 600) {
                    this.$store.commit('set_mobile', false)
                }
            }, false);
        },
        computed: {
            mobile () {
                return this.$store.getters.mobile
            },

            currentUser () {
                return this.$store.getters.currentUser
            },

            connected () {
                return this.$store.getters.connected
            },

            chatID () {
                return this.$store.getters.currentChat
            }
        },
        methods: {
            checkInnerWidth () {
                let innerWidth = window.innerWidth;

                if (innerWidth < 650) {
                    this.$store.commit('set_mobile', true)
                } else if (this.mobile && innerWidth >= 650) {
                    this.$store.commit('set_mobile', false)
                }
            },

            openModal () {
                this.toggleNavigation()
            },

            toggleModal (name) {
                this[name] = !this[name]
            },

            toggleNavigation () {
                this.drawer = !this.drawer
            }
        }
    }
</script>

<style lang="stylus">
    .vertical-panes
        width 100%;
        height 100%;

    .v-content
        flex auto

    .pane1
        min-width 300px
        width 350px
        max-width 600px

    .pane2
        flex-grow 1

    .multipane-resizer
        &:before
            content: "";
            position: absolute
            height: 100%
            width: 0.5px
            background-color: rgba(0, 0, 0, 0.12)
            z-index: 4
            left: 50%
            transform: translateX(50%)

    .grow-0
        flex-grow 0

    .grow-1
        flex-grow 1

    .text-clamp-3
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;

    .divider
        box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.2) !important;
        z-index 1

    .divider-top
        box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.2) !important;
        z-index 1
    .application--wrap
        display -webkit-box!important
</style>