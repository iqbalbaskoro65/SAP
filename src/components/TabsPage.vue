<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet />
      <ion-tab-bar slot="bottom" id="app-tab-bar">
        <ion-tab-button tab="" class="first" />
        <ion-tab-button tab="" class="second" />

        <ion-tab-button
          style="background: transparent"
          tab="home"
          href="/page/home"
        >
          <div class="tabs-home">
            <ion-icon
              style="font-size: 2rem; color: white"
              :icon="homeOutline"
            ></ion-icon>
          </div>
        </ion-tab-button>
        <ion-tab-button tab="" class="third" />
        <ion-tab-button tab="" class="fourth" />
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script>
import {
  IonRouterOutlet,
  IonTabs,
  IonIcon,
  IonPage,
  IonTabBar,
  IonTabButton,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { homeOutline, home, cash, create, personCircle } from "ionicons/icons";

export default defineComponent({
  name: "App",
  components: {
    IonRouterOutlet,
    IonTabs,
    IonIcon,
    IonPage,
    IonTabBar,
    IonTabButton,
  },
  setup() {
    return {
      homeOutline,
      home,
      cash,
      create,
      personCircle,
    };
  },
});
</script>
