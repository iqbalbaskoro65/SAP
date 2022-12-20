<template>
  <ion-page>
    <ion-content class="splash-screen">
      <div class="container-splash">
        <div class="circle-splash">
          <div class="content-splash">
            <img src="../assets/img/k3.png" alt="" />
            <div
              v-if="plat == 'ios'"
              class="title-wave animate__animated animate__zoomIn"
            >
              <span style="--i: 1">B</span>
              <span style="--i: 2">B</span>
              <span style="--i: 3">S</span>
              <span style="--i: 4">P</span>
            </div>
            <div v-else class="title-wave animate__animated animate__zoomIn">
              <span style="--i: 1">S</span>
              <span style="--i: 2">A</span>
              <span style="--i: 3">P</span>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { IonPage, IonContent } from "@ionic/vue";
import { useRouter } from "vue-router";
import ls from "localstorage-slim";
import { Capacitor } from "@capacitor/core";
export default defineComponent({
  name: "SplashScreen",
  components: {
    IonPage,
    IonContent,
  },
  setup() {
    const router = useRouter();
    const plat = ref();
    onMounted(() => {
      const platform = Capacitor.getPlatform();
      plat.value = platform;
    });
    setTimeout(() => {
      ls.set("loading-screen", false, { encrypt: true });
      router.push({ name: "home", replace: true });
    }, 3500);
    return { plat };
  },
});
</script>

<style>
ion-content.splash-screen {
  --background: url("../assets/background/bg-pot.png") no-repeat center center /
    cover;
}
</style>
