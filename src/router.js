import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Anasayfa",
        component: () => import('./views/Home.vue'),
    },
    {
        path: "/about",
        name: "Hakkında",
        component: () => import('./views/About.vue'),
    },
    {
        path: "/helloworld",
        name: "Helloworld",
        component: () => import('./components/HelloWorld.vue'),
    },
    {
        path: "/barcode",
        name: "Barkod",
        component: () => import('./views/barcode.vue'),
    },
    {
        path: "/test",
        name: "test",
        component: () => import('./views/test.vue'),
    }
];

export const router = new VueRouter({
    mode: "history",
    routes,
});
