<template>
    <div class="table-responsive">
        <table :class="classes">
            <caption class="d-none">{{ description }}</caption>
            <thead v-if="this.$slots.header">
                <slot name="header"></slot>
            </thead>
            <tbody>
                <slot></slot>
            </tbody>
        </table>
    </div>
</template>

<script>
import {computed, reactive} from "vue";

export default {
    name: 'base-table',

    props: {
        description: {
            type: String,
            required: false,
            default: ''
        },
        dark: {
            type: Boolean,
            required: false,
            default: false
        },
        hoverable: {
            type: Boolean,
            required: false,
            default: false
        },
        striped: {
            type: String,
            required: false,
            default: '',
            validator: function (value) {
                return ['', 'row', 'column'].indexOf(value) !== -1;
            },
        },
        border: {
            type: Boolean,
            required: false,
            default: false
        },
        compact: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    setup(props) {
        props = reactive(props);

        return {
            classes: computed(() => ({
                'table': true,
                'table-dark': props.dark,
                'card-table': true,
                'align-middle': true,
                'table-sm': props.compact,
                'table-hover': props.hoverable,
                'table-striped': props.striped === 'row',
                'table-striped-column': props.striped === 'column',
                'table-bordered': props.border,
                'table-borderless': props.border === false
            }))
        }
    }
};
</script>

<style>
td {
    width: auto;
}

td.min {
    width: 1%;
    white-space: nowrap;
}
</style>