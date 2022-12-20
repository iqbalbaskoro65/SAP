<template>
  <ion-page>
    <ion-header mode="ios">
      <ion-toolbar>
        <ion-back-button default-href="/" slot="start" />
        <ion-title>Hazop Report</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="menu-hazop ion-padding">
      <ion-grid>
        <ion-row>
          <ion-col size="6" size-md="12" size-lg="12">
            <ion-card class="list-menu-hazop" @click="toNavigate('list-hazop')">
              <img :src="require(`../../assets/icons/list-hazop.png`)" alt="" />
              <h1>
                Riwayat <br />
                Hazop
              </h1>
            </ion-card>
          </ion-col>
          <ion-col size="6" size-md="12" size-lg="12">
            <ion-card class="list-menu-hazop" @click="toNavigate('hazop')">
              <img :src="require(`../../assets/icons/add-hazop.png`)" alt="" />
              <h1>
                Input <br />
                Hazop
              </h1>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonContent,
  IonCard,
  modalController,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import ModalCs from "../../components/ModalCs.vue";
import ls from "localstorage-slim";
import { alertV } from "../../composables/alerts";

export default defineComponent({
  name: "menuHazop",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonBackButton,
    IonContent,
    IonCard,
    IonGrid,
    IonRow,
    IonCol,
  },
  setup() {
    const router = useRouter();
    const mode = ref();

    onMounted(() => {
      const connection = ls.get("mode", { decrypt: true });
      mode.value = connection;
    });

    const toNavigate = async (link) => {
      if (link == "cs") {
        const modal = await modalController.create({
          component: ModalCs,
          cssClass: "transparent-modal",
        });
        return modal.present();
      } else {
        if (mode.value == "offline" && link == "list-hazop") {
          alertV(
            "Perhatian",
            "Anda harus terhubung dengan internet untuk bisa melihat riwayat Hazop Report, silahkan login kembali untuk bisa mengakses menu ini"
          );
        } else {
          router.push({ name: link });
        }
      }
    };
    return {
      router,
      toNavigate,
    };
  },
});
</script>

<style>
ion-content.menu-hazop {
  --background: #f9f9ff;
}
ion-card.list-menu-hazop {
  margin: 0;
  padding: 15px;
  text-align: center;
  border-radius: 25px;
}

.list-menu-hazop img {
  width: 100%;
  max-width: 100px;
  margin-bottom: 10px;
}
.list-menu-hazop h1 {
  margin: 0;
  font-size: 3vh;
  color: black;
}

.menu-hazop ion-col {
  text-align: center;
}
</style>
