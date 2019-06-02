import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
    {
        path:"/c3",
        component: () => import ("@/views/c3.vue")
    },
    {
        path:"/c4",
        component: () => import ("@/views/c4.vue")
    },
    {
        path:"/c5",
        component: () => import ("@/views/c5.vue")
    },
    {
        path:"/c6",
        component: () => import ("@/views/c6.vue")
    },
    {
        path:"/c7",
        component: () => import ("@/views/c7.vue")
    },
]

var router =  new VueRouter({
    routes
})

export default router;