<template>
    <v-dialog v-model="modal" max-width="350" lazy scrollable>
        <v-card>
            <v-card-title class="py-2">
                <div class="title">Settings</div>

                <v-spacer />

                <v-btn icon @click="close">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text class="pa-0" style="height: auto; min-height: 350px">
                <v-list dense two-line >
                    <v-list-tile ripple @click="toggleVoiceRecognition" >
                        <v-list-tile-action>
                            <v-icon>record_voice_over</v-icon>
                        </v-list-tile-action>

                        <v-list-tile-content>
                            <v-list-tile-title>Enable messages voice recognition</v-list-tile-title>
                        </v-list-tile-content>

                        <v-list-tile-action>
                            <v-switch class="ml-2" readonly hideDetails v-model="voiceRecognition" />
                        </v-list-tile-action>
                    </v-list-tile>

                    <!--<v-list-tile ripple @click="setAvatar" >-->
                        <!--<v-list-tile-action>-->
                            <!--<v-icon>face</v-icon>-->
                        <!--</v-list-tile-action>-->

                        <!--<v-list-tile-content>-->
                            <!--<v-list-tile-title>Set avatar</v-list-tile-title>-->
                        <!--</v-list-tile-content>-->
                    <!--</v-list-tile>-->
                </v-list>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    import DateFilters from '../filters/date'
    import Lodash from 'lodash'

    export default {
        name: "Settings",
        mixins: [DateFilters],
        watch: {},
        data: ()=>({
            // voiceRecognition: false
        }),
        computed: {
            modal: {
                get () {
                    return this.$store.getters.modals.settings
                },
                set () {
                    this.close()
                }
            },

            mobile () {
                return this.$store.getters.mobile
            },

            voiceRecognition: {
                get () {
                    return this.$store.getters.voiceRecognition
                },

                set (v) {
                    this.$store.commit('set_voiceRecognition', v)
                }
            }
        },
        methods: {
            close () {
                this.$emit('close');
                this.$store.commit('set_modal', {name: 'settings', value: false});
                this.clear();
            },

            clear () {

            },

            toggleVoiceRecognition () {
                this.voiceRecognition = !this.voiceRecognition
            },

            setAvatar () {
                this.$store.commit('set_modal', {name: 'setAvatar', value: true});
            }
        }
    }
</script>