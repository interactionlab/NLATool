<template>
    <a v-if="url != ''" v-bind:href="mapsurl" target="_blank"><img v-bind:src="url" style="width: 100%;"/></a>
</template>
<script>
    export default {
        props: {
            googleapikey: {type: String, default: ""},
            name: {type: String, default: ""},
            index: {type: Number, default: -1},
            researchedentity: {type: Object, default: null},
        },

        data: function () {
            return {
                url: '',
                mapsurl: ''
            }
        },
        methods: {
            setmap: function () {
                let lat = this.researchedentity.lat;
                let lng = this.researchedentity.lng;

                this.url = 'https://maps.googleapis.com/maps/api/staticmap?center='
                    + this.researchedentity.lat + ','
                    + this.researchedentity.lng + '&size=640x400&visible='
                    + this.researchedentity.northEastLat + ','
                    + this.researchedentity.northEastLng + '|'
                    + this.researchedentity.southWestLat + ','
                    + this.researchedentity.southwestLng
                    + '&markers=color:red%7Clabel:A%7C'
                    + this.researchedentity.lat + ','
                    + this.researchedentity.lng
                    + '&key=' + this.googleapikey;
                this.mapsurl = 'https://www.google.com/maps/search/?api=1&query=' + this.name;
            }
        },
        mounted() {
            this.setmap();
        },
    }
</script>

<style scoped>

</style>