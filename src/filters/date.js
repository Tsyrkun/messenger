import moment from 'moment'

export default {
    filters: {
        shortTime (v) {
            let input = moment(v);
            let today = moment();

            let isToday = input.isSame(today, 'd');
            // let isYesterday = input.isSame(today.subtract(1, 'day'), 'd');

            if (isToday) return input.format('HH:mm');
            // if (isYesterday) return 'yesterday';

            return input.format('DD.MM.YY')
        },

        lastSeen (v) {
            let input = moment(v);
            let today = moment();

            let isToday = input.isSame(today, 'd');
            let isYesterday = input.isSame(today.subtract(1, 'day'), 'd');

            return `last seen ${input.fromNow()}`
        },

        time (v) {
            return new Date(v).toLocaleTimeString().slice(0, -3)
        },
    }
}