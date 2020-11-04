<template>
    <v-card tile flat class="column-wrapper">
        <v-img
                v-if="img"
                src="https://i.imgur.com/hHH1QSF.jpg"
                aspect-ratio="1"
                height="100%"
                class="grey lighten-2"
        >
           <div class="column-wrapper">
               <slot></slot>
           </div>

        </v-img>

        <slot v-else></slot>
    </v-card>
</template>

<script>
    export default {
        name: "Wrapper",
        props: {
            img: {
                type: Boolean,
                default: false
            }
        }
    }
</script>

<style lang="stylus">
    .column-wrapper
        height: 100% !important;
        width: 100%;
        display: flex;
        flex-direction: column;
</style>