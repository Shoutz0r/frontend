<template>
    <div class="artists">
        <span v-for="(artist, index) in artists"
              :key="artist.id"
        >
            <template v-if="index !== 0">, </template>
            <router-link
                @click.stop
                :to="{ name:'artist', params:{ id: artist.id } }"
                class="artist"
            >{{ artist.name }}</router-link>
        </span>
    </div>
</template>

<script>
export default {
    name: 'artist-list',
    props: {
        artists: {
            type: Array,
            default: [],
            required: true
        }
    }
}
</script>

<style>
a.artist {
    color: inherit;
}
</style>