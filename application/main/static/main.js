const { createApp, reactive } = Vue;
const { createRouter, createWebHistory } = VueRouter;

//Page imports
//import Home from "/static/pages/Home.js";
import About from "/static/pages/About.js";
import Alexis from "/static/pages/Alexis.js";
import Athan from "/static/pages/Athan.js";
import David from "/static/pages/David.js";
import Jun from "/static/pages/Jun.js";
import Yuming from "/static/pages/Yuming.js";
import Postings from "/static/pages/Postings.js";
import Item from "/static/pages/Item.js";
import Dashboard from "/static/pages/Dashboard.js";
import Results from "/static/pages/Results.js";
import Login from "/static/pages/Login.js";
import Signup from "/static/pages/Signup.js";

//Component imports
import Navbar from "/static/components/Navbar.js";

//Search results/data are made global so that all pages can access it.
const searchData = reactive({
    results: [],
});

const routes = [
    { path: "/", component: Dashboard },
    { path: "/about", component: About },
    { path: "/postings", component: Postings },
    { path: "/item", component: Item },
    { path: "/dashboard", component: Dashboard},
    { path: "/results", component: Results},
    { path: "/about/alexis", component: Alexis },
    { path: "/about/athan", component: Athan },
    { path: "/about/david", component: David },
    { path: "/about/jun", component: Jun },
    { path: "/about/yuming", component: Yuming },
    { path: "/login", component: Login},
    { path: "/signup", component: Signup}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const app = createApp({});
app.provide("searchData", searchData);
app.component("Navbar", Navbar);
app.use(router);
app.mount("#app");
