<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent" aria-expanded="false"
              aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0"> <!--v-if="currentUser"-->
          <li class="nav-item" v-for="routes in links" :key="routes.id">
            <router-link
                :class="{ active: $route.path === routes.page }"
                class="nav-link"
                :to="routes.page">{{ routes.text }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "navbar",
  data() {
    return {
      links: [
        {
          id: 0,
          text: 'Home',
          page: '/',
        },
        {
          id: 1,
          text: 'About',
          page: '/about',
        },
        {
          id: 2,
          text: 'Barcode Design',
          page: '/designBarcode',
        },
        {
          id: 2,
          text: 'Test Design',
          page: '/testDesign',
        },
      ],
    };
  },
}
</script>

<style scoped>
.navbar{
  padding-right: 0;
}
</style>
