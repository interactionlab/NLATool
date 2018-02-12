<template>
    <div class="googlemap" :id="googlemapname"></div>
</template>

<script>
    export default {
        props: ['name'],
        data: function () {
            return {
                googlemapname: this.name + "-map",
                mapoptions: {
                    zoom: 14,
                    center: new google.map.LatLng(51.501527, -0.1921837)
                }
            }
        },
        mounted() {
            console.log('MapName: ' + this.googlemapname);
            const element = document.getElementById(this.googlemapname);
            const mapoptions = {
                zoom: 14,
                center: new google.maps.LatLng(51.501527, -0.1921837)
            };
            const map = new google.maps.Map(element, options);
        },
        methods:{
            setmapcoordinates: function (x,y) {
                this.mapoptions.center = new google.map.LatLng(x, y);
            }
        }
    }
</script>

<style scoped>

</style>