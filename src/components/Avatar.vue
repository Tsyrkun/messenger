<template>
    <v-badge
            class="user-status"
            color="green"
            right
            bottom
            overlap
            v-model="online"
    >
        <v-icon
                slot="badge"
                dark
                small
        ></v-icon>
        <v-avatar :size="size" :color="colors[palette]" class='shadow'>
            <img v-if="avatar" :src="avatar" :alt="title">
            <span :style="{'font-size': fontSize}" v-else class="white--text headline">{{initials}}</span>
        </v-avatar>
    </v-badge>
</template>

<script>
    export default {
        name: "Avatar",
        props: {
            avatar: String,
            title: {
                type: String,
                default: 'hui'
            },
            size: {
                type: String,
                default: '48'
            },
            online: {
                type: Boolean,
                default: false
            },
            palette: {
                type: Number,
                default: 0
            }
        },
        computed: {
            initials () {
                return this.title ? this.title.slice(0, 1).toUpperCase() : ''
            },
            fontSize () {
                return this.size * .5 + 'px!important'
            },
            color () {
                return this.online
                    ? 'green'
                    : 'transparent'
            },
            colors () {
                return ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'amber', 'orange', 'deep-orange', 'brown', 'blue-grey', 'grey']
            }
        }
    }
</script>

<style lang="stylus">
    .shadow {
        box-shadow 0 0 2px rgba(0,0,0,.2)
    }

    .user-status {
        .v-badge__badge {
            bottom: 0!important;
            right: 0!important;
            border: 2px solid #FAFAFA!important;
            height 15px;
            width 15px;
        }
    }
</style>