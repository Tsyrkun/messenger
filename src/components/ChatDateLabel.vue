<template>
    <div class="text-xs-center my-1">
        <v-chip small disabled color="grey" text-color="white">{{ display }}</v-chip>
    </div>
</template>

<script>
    import moment from 'moment'

    export default {
        name: "ChatDateLabel",
        props: ['date'],
        computed: {
            display () {
                return moment(this.date).format('D MMMM')

            }
        }
    }
</script>

<style>

</style>