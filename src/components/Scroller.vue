<template>
    <div class="scroller" ref="scroller" :style="{height: height}" @scroll="onScroll">
        <v-progress-linear
                v-if="loading"
                class="loading"
                color="green"
                height="5"
                indeterminate
        ></v-progress-linear>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "Scroller",
        props: ['height', 'loading'],
        data: () => ({
            scroll: false,
            lastScrollTop: 0,
            scrolled: {
                total: 0,
                fromBottom: 0,
                fromTop: 0
            }
        }),
        watch: {
            items () {
                // setTimeout(() => this.hasScrollBar(), 10)
            }
        },
        methods: {
            // hasScrollBar () {
            //     this.scroll = this.$refs.scroller.scrollHeight > this.$refs.scroller.clientHeight
            // },

            onScroll (e) {
                let total = Math.ceil(e.target.scrollTop / (e.target.scrollHeight - e.target.offsetHeight) * 100);
                let fromBottom = Math.ceil(e.target.scrollHeight - e.target.scrollTop - e.target.offsetHeight);

                this.scrolled.total = total;
                this.scrolled.fromBottom = fromBottom;
                this.scrolled.fromTop = e.target.scrollTop;

                this.$emit('update', this.scrolled);

                if (this.lastScrollTop < e.target.scrollTop) {
                    this.$emit('scrollDown');
                } else {
                    this.$emit('scrollUp');
                }

                this.lastScrollTop = e.target.scrollTop;
            },
        },
        mounted () {
            // this.hasScrollBar()
        }
    }
</script>

<style>
    .loading {
        position: absolute;
        width: 100%;
        top: 0
    }

    .v-progress-linear.loading {
        margin: 0;
    }

    .scroller {
        flex: 1 1 auto;
        overflow-y: auto;
        min-height: 0;
        position: relative;
        padding-bottom: 0;
    }

    ::-webkit-scrollbar {
        width: 8px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        /*-webkit-border-radius: 5px;*/
        /*border-radius: 5px;*/
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        /*-webkit-border-radius: 5px;*/
        /*border-radius: 5px;*/
        background: rgba(255, 0, 0, 0.8);
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
    }

    ::-webkit-scrollbar-thumb {
        background: #42A5F5;
    }
</style>