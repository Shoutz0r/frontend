<template>
    <div>
        <div class="row row-cards">
            <div class="col-sm-6 col-md-4">
                <div class="card card-sm">
                    <div class="card-body d-flex align-items-center">
                        <span class="bg-lime-lt avatar mr-3">
                            <b-icon-people-fill />
                        </span>
                        <div class="ms-3 lh-sm">
                            <div class="strong">
                                132 Accounts
                            </div>
                            <div class="text-muted">12 waiting approval</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-sm-12">
            </div>
        </div>
    </div>
</template>

<script>
import { BIconPeopleFill } from 'bootstrap-icons-vue';

export default {
    name: "admin-dashboard",
    components: {
        BIconPeopleFill
    }
};
</script>
