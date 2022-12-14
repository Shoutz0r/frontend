<template>
    <nav class="base-pagination-controls pagination-wrapper">
        <ul :class="classes">
            <li v-if="showFirst" class="page-item" :class="hasPrev ? '' : 'disabled'">
                <span class="page-link" @click.prevent="onNavigate(1)">&laquo;</span>
            </li>

            <li v-if="showPrev" class="page-item" :class="hasPrev ? '' : 'disabled'">
                <span class="page-link" @click.prevent="onPrev">Previous</span>
            </li>

            <li class="page-item" v-for="page in showBefore">
                <span class="page-link" @click.prevent="onNavigate(page)">{{ page }}</span>
            </li>

            <li class="page-item active"><span class="page-link">{{ currentPage }}</span></li>

            <li class="page-item" v-for="page in showAfter">
                <span class="page-link" @click.prevent="onNavigate(page)">{{ page }}</span>
            </li>

            <li v-if="showNext" class="page-item" :class="hasNext ? '' : 'disabled'">
                <span class="page-link" @click.prevent="onNext">Next</span>
            </li>

            <li v-if="showLast" class="page-item" :class="hasNext ? '' : 'disabled'">
                <span class="page-link" @click.prevent="onNavigate(totalPages)">&raquo;</span>
            </li>
        </ul>
    </nav>
</template>

<script>
import {computed, reactive} from "vue";

export default {
    name: 'base-pagination-controls',
    props: {
        currentPage: {
            type: Number,
            required: true
        },
        totalPages: {
            type: Number,
            required: true
        },
        maxPerSide: {
            type: Number,
            required: false,
            default: 2
        },
        onNavigate: {
            type: Function,
            required: true,
            default: (page) => {}
        },
        showFirst: {
            type: Boolean,
            required: false,
            default: false,
        },
        showLast: {
            type: Boolean,
            required: false,
            default: false,
        },
        showPrev: {
            type: Boolean,
            required: false,
            default: true,
        },
        showNext: {
            type: Boolean,
            required: false,
            default: true,
        },
        size: {
            type: String,
            required: false,
            validator: function (value) {
                return ['normal', 'large', 'small'].indexOf(value) !== -1;
            },
            default: 'normal'
        },
        justify: {
            type: String,
            required: false,
            validator: function (value) {
                return ['start', 'center', 'end'].indexOf(value) !== -1;
            },
            default: 'start'
        }
    },
    setup(props) {
        props = reactive(props);

        return {
            classes: computed(() => ({
                'mb-0': true,
                'pagination': true,
                'pagination-sm': props.size === 'small',
                'pagination-lg': props.size === 'large',
                'justify-content-start': props.justify === 'start',
                'justify-content-center': props.justify === 'center',
                'justify-content-end': props.justify === 'end',
            }))
        }
    },
    computed: {
        hasPrev() {
            return this.currentPage - 1 >= 1;
        },
        hasNext() {
            return this.currentPage + 1 <= this.totalPages;
        },
        maxPagesToShow() {
            return this.maxPerSide * 2;
        },
        maxOnLeftSide() {
            if(this.currentPage <= this.maxPerSide) {
                return this.currentPage;
            }

            return this.maxOnRightSide >= this.maxPerSide
                ? this.maxPerSide
                : this.maxPagesToShow - this.maxOnRightSide;
        },
        maxOnRightSide() {
            // Nothing to show on the right side when we're on the last page already
            if(this.currentPage >= this.totalPages) {
                return 0;
            }

            // Start with the max that we can show
            let toShow = this.maxPerSide * 2;

            // If the left side is showing it's maximum amount
            if(this.currentPage > this.maxPerSide) {
                toShow = this.maxPerSide;
            }
            // Left side will be showing less than the maxPerSide
            else {
                toShow -= this.currentPage - 1;
            }

            // Finally, do a check that we're not showing pages beyond the number of totalPages
            if(toShow >= this.totalPages - this.currentPage) {
                return this.totalPages - this.currentPage;
            }

            return toShow;
        },
        showBefore() {
            let res = [];
            for(let i = 1; i <= this.maxOnLeftSide; i++) {
                let n = this.currentPage - i;
                // There is no page 0 or lower
                if(n < 1) {
                    continue;
                }
                res.push(n);
            }
            res.reverse();
            return res;
        },
        showAfter() {
            let res = [];
            for(let i = 1; i <= this.maxOnRightSide; i++) {
                res.push(i + this.currentPage);
            }
            return res;
        }
    },
    methods: {
        onNext() {
            if(!this.hasNext) {
                return;
            }
            this.onNavigate(this.currentPage + 1);
        },
        onPrev() {
            if(!this.hasPrev) {
                return;
            }
            this.onNavigate(this.currentPage - 1);
        }
    }
}
</script>

<style lang="scss">
.base-pagination-controls .pagination {
    $pagination-outer-border-color: $secondary;

    .page-item {
        border-top: 1px solid $pagination-outer-border-color;
        border-bottom: 1px solid $pagination-outer-border-color;
        cursor: pointer;

        &.disabled, &.active {
            cursor: default;
        }

        &:first-child {
            border-left: 1px solid $pagination-outer-border-color;
            border-top-left-radius: $border-radius;
            border-bottom-left-radius: $border-radius;
        }

        &:last-child {
            border-right: 1px solid $pagination-outer-border-color;
            border-top-right-radius: $border-radius;
            border-bottom-right-radius: $border-radius;
        }
    }
}
</style>