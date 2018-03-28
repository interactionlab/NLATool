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
                mapsurl: '',
                mapcoordinates: [],
                mapoptions: {
                    zoom: 14,
                    center: '',
                },
            }
        },
        methods: {
            setmapcoordinates: function (x, y) {
                this.mapoptions.center = new google.map.LatLng(x, y);
            },
            fAfter: function (data) {
                this.mapcoordinates = data;
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
            },
            getData: function (fAfter) {
                let service_url = 'https://maps.googleapis.com/maps/api/geocode/json';
                let params = {
                    address: this.name,
                    key: this.googleapikey,
                    format: "jsonp"
                };
                $.getJSON(service_url, params, function (json) {
                    if (fAfter !== undefined) {
                        if (json.results[0].geometry !== undefined) {
                            fAfter(json.results[0].geometry);
                        } else {
                            console.log('WARNING: Google Geocoding API not activated.');
                        }
                    }
                });
            }
        },
        mounted() {
            this.getData(this.fAfter);
        },
        watch: {
            url: function () {
                console.log('URL changes' + this.url);
            }
        }
    }
</script>

<style scoped>

</style>