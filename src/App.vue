<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent, onMounted } from "vue";
// import { SplashScreen } from "@capacitor/splash-screen";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
  },
  setup() {
    onMounted(() => {
      // SplashScreen.hide();
    });
  },
});
</script>
