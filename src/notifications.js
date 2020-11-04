import sound1 from './assets/sounds/quite-impressed.mp3'

const ResponsiveVoice = window.responsiveVoice;

export default class {
    static voiceMessage (author, text) {
        ResponsiveVoice.speak(`${author} пишет ${text}`, 'Russian Female');
    }

    static greeting () {
        ResponsiveVoice.speak(`Приветсвую, Хозяин`, 'Russian Female');
    }

    static goodbye () {
        ResponsiveVoice.speak(`Не покидайте меня, Хозяин`, 'Russian Female');
    }

    static bell () {
        const soundNewMessage = new Audio(sound1);
        soundNewMessage.play();

    }
}