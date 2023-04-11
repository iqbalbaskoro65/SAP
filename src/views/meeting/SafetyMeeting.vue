<template>
  <ion-page>
    <ion-header mode="ios">
      <ion-toolbar>
        <ion-back-button default-href="/" slot="start" />
        <ion-title>Safety Meeting</ion-title>
      </ion-toolbar>
      <offline-mode></offline-mode>
    </ion-header>
    <ion-content class="safety-meeting">
      <div class="main-content">
        <div class="first-content">
          <img src="../../assets/img/k3.png" alt="" />
        </div>
        <div class="second-content"></div>
        <div class="flex-center">
          <swiper :modules="modules" :pagination="{ clickable: true }">
            <swiper-slide>
              <div class="swiper-meeting">
                <h1
                  style="
                    margin: 0;
                    color: white;
                    font-weight: 600;
                    font-size: 1.7rem;
                  "
                >
                  Safety Meeting Mingguan
                </h1>
                <ion-button
                  style="
                    width: 80%;
                    height: 40%;
                    color: #1c6afa;
                    font-size: 1.2rem;
                  "
                  expand="block"
                  shape="round"
                  color="light"
                  @click.prevent="ToNavigate('Mingguan')"
                >
                  submit
                </ion-button>
              </div>
            </swiper-slide>
            <swiper-slide>
              <div class="swiper-meeting">
                <h1
                  style="
                    margin: 0;
                    color: white;
                    font-weight: 600;
                    font-size: 1.7rem;
                  "
                >
                  Safety Meeting General
                </h1>
                <ion-button
                  style="
                    width: 80%;
                    height: 40%;
                    color: #1c6afa;
                    font-size: 1.2rem;
                  "
                  expand="block"
                  shape="round"
                  color="light"
                  @click.prevent="ToNavigate('General')"
                >
                  submit
                </ion-button>
              </div>
            </swiper-slide>
          </swiper>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination } from "swiper";
import { defineComponent, onMounted, onUpdated } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButton,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { hideTabBar } from "../../composables/hideTabs";
import OfflineMode from "../../components/OfflineMode.vue";

import "swiper/css";
import "swiper/css/pagination";
export default defineComponent({
  name: "SafetyMeeting",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonBackButton,
    IonButton,
    Swiper,
    SwiperSlide,
    OfflineMode,
  },
  setup() {
    const router = useRouter();
    onMounted(() => {
      var interval = setInterval(() => {
        console.log(router.currentRoute.value.name);
        if (router.currentRoute.value.name != "meeting") {
          setTimeout(() => {
            clearInterval(interval);
          }, 1000);
        } else {
          hideTabBar();
        }
      }, 200);
    });
    onUpdated(() => {
      var interval = setInterval(() => {
        if (router.currentRoute.value.name != "meeting") {
          setTimeout(() => {
            clearInterval(interval);
          }, 1000);
        } else {
          hideTabBar();
        }
      }, 200);
    });
    const ToNavigate = (props) => {
      router.push({ name: "safety", params: { title: props } });
    };
    return { ToNavigate, modules: [Pagination] };
  },
});
</script>

<style>
ion-content.safety-meeting {
  --background: #1c6afa;
}
</style>
