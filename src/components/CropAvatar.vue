<template>
    <v-dialog v-model="modal" max-width="350" lazy persistent>
        <v-card>
            <div>
                <img id="image" ref="image">
            </div>
            <v-card-actions>
                <v-btn flat color="blue" @click="selectFile">select image</v-btn>
                <v-spacer />
                <v-btn flat color="blue" @click="close">cancel</v-btn>
                <v-btn flat color="blue" @click="getImage">save</v-btn>
            </v-card-actions>
            <input type="file" accept=".png, .jpg, .jpeg" style="display: none" ref="input" @change="fileSelected">
        </v-card>
    </v-dialog>
</template>

<script>
    import DefaultAvatar from '../assets/default_avatar.png'
    import 'cropperjs/dist/cropper.css';
    import Cropper from 'cropperjs';

    export default {
        name: "CropAvatar",
        data: () => ({
            cropper: null,
            loading: false,
            img: null
        }),
        watch: {
            img (v) {
                if (v) {
                    // this.cropper.setCanvasData({
                    //     width: 350,
                    //     height: 350
                    // })
                }
            },
            modal (v) {
              if (v) {
                  setTimeout(()=> this.$refs.input.click(), 100)
              }
            }
        },
        computed: {
            modal: {
                get () {
                    return this.$store.getters.modals.setAvatar
                },
                set () {
                    this.close()
                }
            },
        },
        created () {

        },
        mounted () {
            this.$refs.image.src = DefaultAvatar
        },
        methods: {
            async getImage () {
                this.loading = true;

                let avatar = this.cropper.getCroppedCanvas().toDataURL();
                console.log(avatar);

                await this.$store.dispatch('setAvatar', avatar);
                this.loading = false;
                this.close()
            },
            close () {
                this.$store.commit('set_modal', {name: 'setAvatar', value: false});
            },

            selectFile () {
                this.$refs.input.click()
            },

            fileSelected (e) {
                let file = e.target.files[0] || e.target.dataTransfer[0];
                let reader = new FileReader();

                reader.onload = (event) => {
                    this.$refs.image.src = event.target.result;

                    const image = document.getElementById('image');

                    this.cropper = new Cropper(image, {
                        aspectRatio: 1,
                        scalable: false,
                        zoomable: false,
                    });

                    this.cropper.reset();
                };

                if (file) {
                    reader.readAsDataURL(file);
                    e.target.value = null
                }
            },

        }
    }
</script>

<style>
    .v-dialog {
        overflow: hidden;
    }

    .cropper-container {
        width: 350px;
        height: 350px !important;
    }

    .cropper-canvas {
        transform: translateY(0) !important;
    }

    img {
        max-width: 100%; /* This rule is very important, please do not ignore this! */
    }
</style>