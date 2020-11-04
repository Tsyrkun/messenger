<template>
    <div ref="message" :class="['message-container', reverse ? 'reversed' : '']" v-if="show">
        <v-flex style='flex-grow: 0; min-width: 34px' class="mx-2" v-if="!mobile">
            <Avatar v-if="!joined" size="34" :title="author.username" :avatar="author.avatar" :palette="author.palette"/>
        </v-flex>

        <v-flex style='flex-grow: 0'>
            <v-menu
                    v-model="showMenu"
                    absolute
                    offset-y
            >
                <v-card slot="activator" class="message-wrapper" :color="my ? '' : 'blue lighten-5'">
                    <div class="message-body">
                        <span class="message-text" ref="text" v-html="urlify(message.content)"></span>

                        <span class="caption ml-2" style="font-size: .8rem!important; float: right; padding-top: 2px;">
                            <span :class="my ? 'green--text' : 'green--text'">{{edited ? 'edited': ''}} {{ message.createdAt | time}}</span>
                            <v-icon v-if="my" class="ml-1" small color='green'>{{ read ? 'done_all' : 'check'}}</v-icon>
                        </span>
                    </div>
                </v-card>

                <v-list dense v-if="my">
                    <v-list-tile
                            v-for="(item, index) in myMenu"
                            :key="index"
                            @click="item.action.apply(this)"
                    >
                        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                    </v-list-tile>
                </v-list>

                <v-list dense v-else>
                    <v-list-tile
                            v-for="(item, index) in otherMenu"
                            :key="index"
                            @click="item.action.apply(this)"
                    >
                        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </v-flex>
    </div>
</template>

<script>
    import DateFilter from '../filters/date'
    import Avatar from '../components/Avatar'

    export default {
        name: "ChatMessage",
        mixins: [DateFilter],
        components: {
            Avatar
        },
        props: {
            hideUnread: {
                type: Boolean
            },
            message: {
                type: Object,
                default: () => ({})
            },
            joined: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            showMenu (v) {
                if (v) this.disableScroll();
                if (!v) this.enableScroll()
            }
        },
        data () {
            return {
                showMenu: false,
                myMenu: [
                    {title: 'Edit', action: this.edit },
                    {title: 'Delete', action: this.delete},
                    {title: 'Copy text', action: this.copy}
                ],
                otherMenu: [
                    {title: 'Delete', action: this.delete},
                    {title: 'Copy text', action: this.copy}
                ]
            }
        },
        beforeDestroy () {
          this.enableScroll()
        },
        methods: {
            preventDefault(e) {
                e = e || window.event;
                if (e.preventDefault)
                    e.preventDefault();
                e.returnValue = false;
            },

            preventDefaultForScrollKeys(e) {
                let keys = {37: 1, 38: 1, 39: 1, 40: 1};
                if (keys[e.keyCode]) {
                    this.preventDefault(e);
                    return false;
                }
            },

            disableScroll () {
                if (window.addEventListener) // older FF
                    window.addEventListener('DOMMouseScroll', this.preventDefault, false);
                window.onwheel = this.preventDefault; // modern standard
                window.onmousewheel = document.onmousewheel = this.preventDefault; // older browsers, IE
                window.ontouchmove = this.preventDefault; // mobile
                document.onkeydown = this.preventDefaultForScrollKeys;
            },

            enableScroll () {
                if (window.removeEventListener)
                    window.removeEventListener('DOMMouseScroll', this.preventDefault, false);
                window.onmousewheel = document.onmousewheel = null;
                window.onwheel = null;
                window.ontouchmove = null;
                document.onkeydown = null;
            },

            urlify (text) {
                let urlRegex = /(https?:\/\/[^\s]+)/g;

                return text.replace(urlRegex, function (url) {
                    return `<a href="${url}">${url}</a>`;
                })
            },
            copy () {
                let textarea = document.createElement('textarea');
                let body = document.querySelector('body');

                textarea.value = this.$refs.text.innerHTML;
                body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                body.removeChild(textarea);
            },
            edit () {
                this.$store.commit('set_editMessage', this.message._id)
            },
            delete () {
                this.$store.commit('set_deleteMessage', this.message._id)
            }
        },
        computed: {
            show () {
                return this.hideUnread ?  this.my ? true : !!this.read : true
            },

            my () {
                return this.message.author === this.currentUser._id
            },

            mobile () {
                return this.$store.getters['mobile']
            },

            reverse () {
                return this.my && this.mobile
            },

            // nextSameAuthor () {
            //     return this.nextMessage
            //         ? this.nextMessage.author === this.message.author
            //         : false
            // },
            //
            // lastInSequence () {
            //     return !this.nextSameAuthor
            // },

            read () {
                return this.message.read
            },

            edited () {
                return this.message.edited
            },

            author () {
                return this.$store.getters['userByID'](this.message.author) || this.currentUser
            },

            currentUser () {
                return this.$store.getters['currentUser']
            }
        }
    }
</script>

<style scoped>
    .message-wrapper {
        border-radius: 5px;
        /*margin-right: 15px*/
    }

    .message-body {
        max-width: 600px;
        padding: 6px;
        font-size: 13px;
        user-select: none;
        cursor: pointer;
        word-break: break-word;
    }

    .message-container {
        display: flex;
        align-items: flex-end;
        padding: 5px 10px;
    }

    .reversed {
        flex-direction: row-reverse;
    }
</style>