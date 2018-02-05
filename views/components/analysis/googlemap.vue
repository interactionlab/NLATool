<template>
    <div  class="googlemap":id="googlemapname"></div>
</template>

<script>
    export default {
        props: ['name'],
        data: function () {
            return {
                googlemapname: this.name + "-map",
            }
        },
        mounted: function () {
            console.log('MapName: '+ this.googlemapname);
            const element = document.getElementById(this.googlemapname);
            const options = {
                zoom: 14,
                center: new google.maps.LatLng(51.501527, -0.1921837)
            };
            const map = new google.maps.Map(element, options);
        }
    }
</script>

<style scoped>

</style>