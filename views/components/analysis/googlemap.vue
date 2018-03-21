<template>
    <img v-bind:src="'https://maps.googleapis.com/maps/api/staticmap?maptype=satellite&center=37.530101,38.600062&zoom=14&size=400x640&key='+googleapikey" style="width: 100%;" />
    
</template>

<script>
    export default {
        props: {
            googleapikey: {type: String, default: ""},
            index: { type: Number, default: -1 },
            mapcoordinates: { type: Array, default: function () { return [] }}
        },

        data: function () {
            return {
                mapoptions: {
                    zoom: 14,
                    center: '',
                },
            }
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