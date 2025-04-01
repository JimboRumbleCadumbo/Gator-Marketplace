const { createApp } = Vue;
const { createRouter, createWebHistory } = VueRouter;

import Home from '/static/Home.js';
import Test from '/static/Test.js';
import SearchBar from "/static/searchbar.js"; 

const routes = [
    { path: "/", component: Home },
    { path: "/test", component: Test }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const app = createApp({});
app.component("search-bar", SearchBar);
app.use(router);
app.mount("#app");