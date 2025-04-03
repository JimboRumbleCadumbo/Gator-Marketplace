const { createApp } = Vue;
const { createRouter, createWebHistory } = VueRouter;

import Home from '/static/pages/Home.js';
import Test from '/static/pages/Test.js';
import Alexis from '/static/pages/Alexis.js';
import Athan from '/static/pages/Athan.js';
import David from '/static/pages/David.js';
import Jun from '/static/pages/Jun.js';
import Yuming from '/static/pages/Yuming.js';

import SearchBar from "/static/Searchbar.js"; 
import Navbar from '/static/Navbar.js';

const routes = [
    { path: "/", component: Home },
    { path: "/test", component: Test },
    { path: "/about/alexis", component: Alexis },
    { path: "/about/athan", component: Athan },
    { path: "/about/david", component: David },
    { path: "/about/jun", component: Jun },
    { path: "/about/yuming", component: Yuming },

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