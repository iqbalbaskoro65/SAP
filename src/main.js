import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";

import { IonicVue } from "@ionic/vue";

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import "./theme/core.css";

/* Animate Js */
import "animate.css";

// axios.defaults.baseURL = "https://www.aakmining.club/appserver";
axios.defaults.baseURL = "https://api.cde-coal.com";
// axios.defaults.baseURL = "https://192.168.1.16";

const app = createApp(App)
  // .use(IonicVue, { mode: "md" })
  .use(IonicVue)
  .use(router);

router.isReady().then(() => {
  app.mount("#app");
});
