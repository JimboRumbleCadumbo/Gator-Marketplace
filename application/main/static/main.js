const { createApp } = Vue;
const { createRouter, createWebHistory } = VueRouter;

import Home from '/static/Home.js';
import Test from '/static/Test.js';
import SearchBar from "/static/Searchbar.js"; 
import Navbar from "/static/Navbar.js";
import Alexis from "/static/Alexis.js";

const routes = [
    { path: "/", component: Home },
    { path: "/test", component: Test },
    { path: "/about/alexis", component: Alexis },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const app = createApp({});
app.component("search-bar", SearchBar);
app.component("navbar", Navbar);
app.use(router);
app.mount("#app");