<template>
    <div class="googlemap" :id="index"></div>
</template>

<script>
    export default {
        props: {
            index: Number,
            mapcoordinates: Array
        },

        data: function () {
            return {
                index: this.index,
                mapoptions: {
                    zoom: 14,
                    center: '',
                },
                mapcoordinates: this.mapcoordinates
            }
        },
        mounted() {
            //console.log('MapName: ' + this.index);
            var element = document.getElementById(this.index);
            this.mapoptions = {
                zoom: 14,
                center: new google.maps.LatLng(51.501527, -0.1921837)
            };
            var map = new google.maps.Map(element, this.mapoptions);
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