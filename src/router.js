import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Home",
        component: () => import('./views/Home.vue'),
    },
    {
        path: "/about",
        name: "About",
        component: () => import('./views/About.vue'),
    },
    {
        path: "/helloworld",
        name: "Helloworld",
        component: () => import('./components/HelloWorld.vue'),
    },
    {
        path: "/designBarcode",
        name: "Design-Barcode",
        component: () => import('./views/Design-Barcode.vue'),
    },
];

export const router = new VueRouter({
    mode: "history",
    routes,
});
