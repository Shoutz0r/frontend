<template>
    <div class="row row-cards">
        <div class="col-sm-12">
            <now-playing></now-playing>
        </div>
    </div>
    <div class="row row-cards">
        <div class="col-sm-12">
            <h2 class="category-header">Coming Up</h2>
            <comingup-table/>
        </div>
    </div>
</template>

<script>
import NowPlaying from "@components/NowPlaying.vue";
import ComingupTable from "@components/ComingupTable.vue";

export default {
    name: "dashboard-view",
    components: {
        NowPlaying,
        ComingupTable,
    }
};
</script>
