<template>
    <header id="header" class="navbar navbar-dark flex-md-nowrap sticky-top p-0">
        <div class="container-fluid">
            <router-link :to="{name: 'dashboard'}" class="navbar-brand order-1">
                <shoutzor-logo class="navbar-brand-image" />
                <!-- 242 x 54 -->
            </router-link>
            <form action="#" @submit.prevent="search"  class="search-container input-group justify-content-center order-3 order-md-2 pt-2 pt-md-0">
                <span class="input-group-text"><b-icon-search /></span>
                <input type="text" name="q" class="form-control" placeholder="Search" aria-label="Search">
            </form>
            <div class="d-flex justify-content-end order-2 order-md-3">
                <ul class="nav">
                    <template v-if="isAuthenticated">
                        <li class="nav-item dropdown">
                            <a class="d-flex align-items-center nav-link link-light dropdown-toggle" href="#" id="navbarDarkDropdownMenuLink"
                               role="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                                <div class="d-inline-block">
                                    <div>{{ user.username }}</div>
                                    <div v-if="user.is_admin" class="small text-muted">Administrator</div>
                                    <div v-else class="small text-muted">User</div>
                                </div>
                            </a>
                            <div class="dropdown-menu dropdown-menu-dark dropdown-menu-right user-dropdown">
                                <a class="dropdown-item" href="#" @click.prevent="logout">Logout</a>
                            </div>
                        </li>
                        <li v-if="can('admin.access')" class="nav-item d-none d-md-flex align-items-center justify-content-center">
                            <router-link :to="{name: 'admin-dashboard'}" class="btn btn-sm btn-outline-primary text-decoration-none">Admin panel</router-link>
                        </li>
                    </template>
                    <template v-else>
                        <li class="nav-item dropdown">
                            <a class="nav-link link-light dropdown-toggle" href="#" id="navbarDarkDropdownMenuLink"
                               role="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                                Login / Register
                            </a>
                            <div class="dropdown-menu dropdown-menu-end dropdown-menu-dark auth-dropdown">
                                <login-form
                                    :onRegisterClick="onRegisterClick"/>
                            </div>
                        </li>
                    </template>
                </ul>
                <button class="navbar-toggler d-md-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-left" aria-controls="sidebarMenu" aria-expanded="true" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
            </div>
        </div>
    </header>
</template>

<script>
import BaseButton from "@components/BaseButton.vue";
import LoginForm from "@components/LoginForm.vue";
import ShoutzorLogo from "@static/images/shoutzor-logo.svg?component";

export default {
    name: 'the-header',
    components: {
        BaseButton,
        LoginForm,
        ShoutzorLogo
    },
    data() {
        return {
            loading: false
        }
    },
    computed: {
        isAuthenticated() { return this.auth.isAuthenticated; },
        user() { return this.auth.user; }
    },
    methods: {
        logout() {
            this.loading = true;

            this.auth.logout()
                .finally(() => {
                    this.loading = false;
                });
        },
        search(e) {
            let q = e?.target?.elements?.q?.value;

            if(!q && q !== "") {
                console.error("input[name=q] not found, cannot perform search!");
            }

            this.$router.push({ name: 'search', query: { q } });
        },
        onRegisterClick() {
            this.$router.push({ name: 'register' });
        }
    }
}
</script>

<style lang="scss">
#header {
    .input-group.search-container {
        width: initial;

        span.input-group-text {
            background-color: $black;
            border: 0;
            padding: 0 0 0 10px;
        }

        input.form-control {
            background-color: $black;
            border: 0;
            padding-left: 8px;
        }
    }
}
</style>