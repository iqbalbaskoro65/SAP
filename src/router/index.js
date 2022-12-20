import { createRouter, createWebHistory } from "@ionic/vue-router";
import TabsPage from "../components/TabsPage.vue";
import ls from "localstorage-slim";

const routes = [
  {
    path: "/",
    redirect: "/page",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginPage.vue"),
  },
  {
    path: "/splash",
    name: "splash",
    component: () => import("../views/SplashScreen.vue"),
  },
  {
    path: "/page/",
    component: TabsPage,
    children: [
      {
        path: "",
        redirect: "/page/home",
      },
      {
        path: "/page/home",
        name: "home",
        component: () => import("../views/HomePage.vue"),
      },
      {
        path: "/page/inspeksi",
        name: "inspeksi",
        component: () => import("../views/inspeksi/PilihInspeksi.vue"),
      },
      {
        path: "/page/detail-inspeksi",
        name: "detailInspeksi",
        component: () => import("../views/inspeksi/Inspeksi.vue"),
      },
      {
        path: "/page/menu-hazop",
        name: "menu-hazop",
        component: () => import("../views/hazop/MenuHazop.vue"),
      },
      {
        path: "/page/list-hazop",
        name: "list-hazop",
        component: () => import("../views/hazop/ListHazop.vue"),
      },
      {
        path: "/page/hazop",
        name: "hazop",
        component: () => import("../views/hazop/Hazop.vue"),
      },
      {
        path: "/page/meeting",
        name: "meeting",
        component: () => import("../views/meeting/SafetyMeeting.vue"),
      },
      {
        path: "/page/meeting/safety/:title",
        name: "safety",
        component: () => import("../views/meeting/ScannerPage.vue"),
        props: true,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const isLoadingScreen = ls.get("loading-screen", { decrypt: true });
  const mode = ls.get("mode", { decrypt: true });
  const token = ls.get("token", { decrypt: true });
  const currentUser = token ? true : mode == "online" || !mode ? false : true;
  console.log(currentUser);
  if (to.name !== "login" && !currentUser) {
    next("/login");
  } else if (to.name === "login" && currentUser) {
    next("/page/home");
  } else if (to.name === "register" && currentUser) {
    next("/page/home");
  } else if (to.name === "splash" && !isLoadingScreen) {
    next("/page/home");
  } else {
    next();
  }
});

export default router;
