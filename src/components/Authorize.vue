<template>
    <v-app>
        <v-content>
            <v-layout fill-height justify-center align-center>
                <v-flex class="card-sign-in">
                    <v-card class="transparent" flat>
                        <img src="~@/assets/povidom.png" alt="Vuetify.js" class="py-4" />
                        <v-card-text>
                            <div class="text-xs-center title">
                                Povidom Web
                            </div>
                        </v-card-text>

                        <v-tabs v-model="action" grow color="transparent">
                            <v-tab ripple :disabled="loading">
                                Sign in
                            </v-tab>

                            <v-tab ripple :disabled="loading">
                                Sign up
                            </v-tab>
                        </v-tabs>

                        <v-card-text>
                            <v-alert
                                    v-if="error"
                                    v-model="error"
                                    dismissible
                                    type="error"
                                    outline
                                    transition="scale-transition"
                            >
                                <div class="text-xs-center"> {{ error.data.message }} </div>
                            </v-alert>

                            <v-form ref="form" v-model="valid">
                                <v-text-field
                                        label="Username"
                                        prepend-icon="person"
                                        v-model="username"
                                        :rules="[required]"
                                        @keyup.enter="submit"
                                        :disabled="loading"
                                        autofocus
                                />

                                <v-text-field
                                        label="Password"
                                        prepend-icon="lock"
                                        v-model="password"
                                        type="password"
                                        :rules="[required]"
                                        @keyup.enter="submit"
                                        :disabled="loading"
                                />

                                <transition name="fade-transition" mode="out-in">
                                    <v-text-field
                                            v-if="action === 1"
                                            label="Confirm password"
                                            prepend-icon="lock"
                                            v-model="conformPassword"
                                            type="password"
                                            :rules="[required, passwordsMatch]"
                                            @keyup.enter="submit"
                                            :disabled="loading"
                                    />
                                </transition>
                            </v-form>
                        </v-card-text>

                        <v-card-actions>
                            <v-btn color="blue" large block @click="submit" :dark="valid" :loading="loading" :disabled="!valid">next
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-content>
    </v-app>
</template>

<script>
    export default {
        name: "Authorize",
        data: () => ({
            valid: false,
            action: 0,
            loading: false,
            err: null,
            username: '',
            password: '',
            conformPassword: ''
        }),
        watch: {
            action () {
                this.conformPassword = ''
            }
        },
        computed: {
            required () {
                return v => !!v || 'This field is required'
            },

            passwordsMatch () {
                return v => v === this.password || 'Passwords don\'t match'
            },

            error: {
                get () {
                    return this.err
                },
                set () {
                    this.err = null
                }
            }
        },
        methods: {
            async submit () {
                if (this.$refs.form.validate()) {
                    if (this.action) {
                        this.loading = true;

                        console.log('Dispatch sign up');

                        try {
                            await this.$store.dispatch('Auth/register', {
                                username: this.username,
                                password: this.password
                            });

                            this.$router.push('/')
                        } catch (error) {
                            this.err = error
                        }

                        this.loading = false;
                    } else {
                        this.loading = true;

                        console.log('Dispatch sign in');

                        try {
                            await this.$store.dispatch('Auth/login', {
                                username: this.username,
                                password: this.password
                            });

                            this.$router.push('/')
                        } catch (error) {
                            this.err = error
                        }
                        this.loading = false;
                    }
                }
            }
        }
    }
</script>

<style lang="stylus">
    .card-sign-in {
        max-width: 350px!important;
    }

    img {
        margin-left: auto;
        margin-right: auto;
        display: block;
        max-height: 200px;
    }

    .v-dialog {
        box-shadow: none;
    }
</style>