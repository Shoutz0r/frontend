<template>
    <div id="modal-container" class="modal-container position-absolute bottom-0 end-0">
        <base-modal
            v-for="modal in modals"
            :key="modal.id"
            :id="modal.id"
            v-bind="modal.options">
            <div v-html="modal.options.body"></div>
        </base-modal>
    </div>
</template>

<script>
import BaseModal from "@components/BaseModal.vue";

export default {
    name: 'the-modalmanager',

    components: {
        BaseModal
    },

    computed: {
        modals() {
            return this.bootstrapControl.modals;
        }
    }
}
</script>
