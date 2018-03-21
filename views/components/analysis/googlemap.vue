<template>
    <img v-if="url != ''" v-bind:src="url" style="width: 100%;" />
</template>

<script>
    export default {
        props: {
            googleapikey: {type: String, default: ""},
            name: {type: String, default: ""},
            index: { type: Number, default: -1 },
        },

        data: function () {
            return {
                url : '',
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
            fAfter: function(data){
                this.mapcoordinates = data;
                let lat = this.mapcoordinates.location.lat;
                let lng = this.mapcoordinates.location.lng;
                
               
                this.url = 'https://maps.googleapis.com/maps/api/staticmap?center='+lat+','+lng+'&size=640x400&visible=' + this.mapcoordinates.viewport.northeast.lat + ',' + this.mapcoordinates.viewport.northeast.lng + '|' + this.mapcoordinates.viewport.southwest.lat + ',' + this.mapcoordinates.viewport.southwest.lng + '&markers=color:red%7Clabel:A%7C'+lat+','+lng+'&key=' + this.googleapikey;
                console.log('Response for Research: ' + JSON.stringify(this.mapcoordinates));
            },
            getData: function(fAfter){
                let service_url = 'https://maps.googleapis.com/maps/api/geocode/json';
                let params = {
                    address: this.name,
                    key: this.googleapikey,
                    format: "jsonp"
                };
                $.getJSON(service_url, params, function (json) {
                    if (fAfter !== undefined){
                        if (json.results[0].geometry  !== undefined){
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