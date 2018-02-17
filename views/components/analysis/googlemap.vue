<template>
    <div class="googlemap" :id="googlemapname"></div>
</template>

<script>
    export default {
        props: {
            index: String,
            mapcoordinates: Array
        },

        data: function () {
            return {
                googlemapname: this.index + "-map",
                mapoptions: {
                    zoom: 14,
                    center: '',
                },
                mapcoordinates: this.mapcoordinates
            }
        },
        mounted() {
            console.log('MapName: ' + this.googlemapname);
            var element = document.getElementById(this.googlemapname);
            this.mapoptions = {
                zoom: 14,
                center: new google.maps.LatLng(51.501527, -0.1921837)
            };
            var map = new google.maps.Map(element, mapOptions);
        },
        methods: {
            setmapcoordinates: function (x, y) {
                this.mapoptions.center = new google.map.LatLng(x, y);

            }
        },
        watch: {
            mapcoordinates: {
                handler: function (newmapcoordinates) {
                    this.setmapcoordinates(newmapcoordinates[this.index].x, newmapcoordinates[this.index].y);
                }

            }
        }
    }
</script>

<style scoped>

</style>