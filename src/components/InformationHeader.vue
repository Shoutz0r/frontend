<template>
    <div class="information-header">
        <div class="item-background">
            <img class="item-image" :src="image" alt="image"/>
            <div class="item-image-overlay"></div>
        </div>
        <div class="information-content card card-aside">
            <img alt="image" class="item-image card-aside-column" :src="image"/>

            <div class="item-content card-body d-flex flex-column mt-auto">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "information-header",
    props: {
        image: {
            type: String,
            required: true
        }
    }
}
</script>

<style lang="scss">
.information-header {
    position: relative;
    width: 100%;
    height: 240px;
    overflow: hidden;
    display: flex;

    .item-background {
        z-index: -9999;

        .item-image {
            position: absolute;
            min-width: 100%;
            top: -115%;
            filter: blur(2px);
        }

        .item-image-overlay {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.1);
            background-repeat: repeat;
            background-position: -7px 0px;
            background-size: contain;
            background-image: url("~static/images/nowplaying_overlay.png");
        }
    }

    .information-content {
        background: transparent;
        border: 0;
        box-shadow: none;
        padding: 10px;
        width: 100%;
        flex-direction: row;
        align-items: flex-end;

        .item-image {
            $imageSize: 200px;
            min-width: $imageSize;
            max-width: $imageSize;
            min-height: $imageSize;
            max-height: $imageSize;
            box-shadow: 0 0 2px $black;
        }

        .item-content {
            padding: 0.5rem 0.5rem 0.1rem;
            color: $white;
            text-shadow: 0 0 4px $black;
            background-color: transparent !important;

            h3 {
                font-size: 1.4rem;
                margin-bottom: 1px;
            }
        }
    }

    @include media-breakpoint-down(lg) {
        height: 150px;

        .item-background > .item-image {
            min-width: 150%;
            top: -200%;
            left: -25%;
        }

        .information-content {
            .item-image {
                $imageSize: 100px;
                min-width: $imageSize;
                max-width: $imageSize;
                min-height: $imageSize;
                max-height: $imageSize;
            }

            .item-content {
                padding: 0 0 0 0.5rem;
                margin-top: -5px !important;
            }
        }
    }

    @include media-breakpoint-down(md) {
        .item-background > .item-image {
            min-width: 200%;
            top: -150%;
            left: -50%;
        }
    }
}
</style>