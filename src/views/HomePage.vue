<template>
  <ion-page>
    <ion-content class="home-page">
      <div class="header-home">
        <div class="title-home">
          <h1
            style="
              font-size: 2rem;
              margin: 0;
              padding-bottom: 5px;
              font-weight: 600;
            "
          >
            {{ title }}
          </h1>
          <h1 style="margin: 0; font-size: 1.5rem">({{ subTitle }})</h1>
        </div>
      </div>
      <div class="main-content">
        <div
          class="card-isi"
          :style="[
            offline_data != null
              ? offline_data.length > 0
                ? { padding: '25px 30px 30px 30px' }
                : { padding: '20px 30px 30px 30px' }
              : { padding: '20px 30px 30px 30px' },
          ]"
        >
          <div
            v-if="offline_data != null && offline_data.length > 0"
            class="warning-hazop card-list"
            @click="uploadOfflineHazop()"
          >
            <ion-icon
              style="color: red; font-size: 1.5rem"
              :icon="warningOutline"
            />
            <span style="margin-left: 5px; font-size: 1.3rem">
              {{ offline_data.length }} data Hazop belum di upload
            </span>
          </div>
          <div class="card-menu" style="padding-top: 10px">
            <div class="card-list" @click="toNavigate('inspeksi')">
              <img :src="require(`../assets/icons/inspection.png`)" alt="" />
              <h1 style="margin: 0">Inspeksi</h1>
            </div>
            <div class="card-list" @click="toNavigate('menu-hazop')">
              <img :src="require(`../assets/icons/hazop.png`)" alt="" />
              <h1 style="margin: 0">Hazop</h1>
            </div>
            <div class="card-list" @click="toNavigate('meeting')">
              <img :src="require(`../assets/icons/meeting.png`)" alt="" />
              <h1 style="margin: 0">Safety</h1>
              <h1 style="margin: 0">Meeting</h1>
            </div>
            <div class="card-list" @click="toNavigate('logout')">
              <img :src="require(`../assets/icons/logout.png`)" alt="" />
              <h1 style="margin: 0">Log Out</h1>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  alertController,
  IonContent,
  IonPage,
  modalController,
  useBackButton,
  IonIcon,
} from "@ionic/vue";
import { defineComponent, onMounted, onUpdated, ref } from "vue";
import { useRouter } from "vue-router";
import { warningOutline } from "ionicons/icons";

//storage
import dataServices from "../services/storage";
import ls from "localstorage-slim";
//composables
import {
  alertV,
  CheckConnection,
  confirmExit,
  toastV,
} from "../composables/alerts";
import { showTabBar } from "../composables/hideTabs";
//modal
import ModalCs from "../components/ModalCs.vue";
import ModalHazop from "../components/ModalHazopReport.vue";
import { Capacitor } from "@capacitor/core";
import axios from "axios";
import { Network } from "@capacitor/network";
import { tokenExpired } from "../composables/alerts";

export default defineComponent({
  name: "HomePage",
  components: {
    IonContent,
    IonPage,
    IonIcon,
  },
  setup() {
    const router = useRouter();
    const employee = ref();
    const mode = ref();
    const offline_data = ref([]);
    const title = ref("S A P");
    const subTitle = ref("Safety Accountability Program");
    const menuList = ref([
      { img: "inspection.png", name: "Inspeksi", link: "inspeksi" },
      { img: "hazop.png", name: "Hazop", link: "hazzob" },
      {
        img: "meeting.png",
        name: `Safety `,
        link: "scanner",
      },
      {
        img: "logout.png",
        name: "Log Out",
        link: "logout",
      },
    ]);
    useBackButton(-1, () => {
      if (router.currentRoute.value.name == "home") {
        confirmExit();
      }
    });

    const toNavigate = async (link) => {
      const connection = await Network.getStatus();
      const status = connection.connected;
      if (link == "cs") {
        modalCs();
      } else if (link == "logout") {
        const loadingScreen = ls.get("loading-screen");
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "Confirm!",
          mode: "ios",
          message: "<strong>Confirm Logout??</strong>",
          buttons: [
            {
              text: "Cancel",
              role: "cancel",
              cssClass: "secondary",
              id: "cancel-button",
              handler: () => {
                console.log("Confirm Cancel");
              },
            },
            {
              text: "Logout",
              id: "confirm-button",
              handler: () => {
                // signOut(auth).then(() => {
                console.log("loggin off...");
                localStorage.clear();
                ls.set("loading-screen", loadingScreen);
                toastV("You Signed Out", "danger");
                setTimeout(() => {
                  router.push("/login");
                  setTimeout(() => {
                    router.push("/login");
                    router.go();
                  }, 500);
                }, 700);
                // });
              },
            },
          ],
        });
        alert.present();
      } else if (link == "meeting") {
        if (status) {
          if (
            employee.value.Department == "IT" ||
            employee.value.Department == "HSE" ||
            employee.value.Department == "Hse" ||
            employee.value.Department == "hse"
          ) {
            router.push(`/page/${link}`);
          } else {
            alertV("Perhatian", "Menu ini khusus untuk Departmen HSE");
          }
        } else {
          router.push(`/page/${link}`);
        }
      } else {
        if (mode.value == "offline" && link == "inspeksi") {
          alertV(
            "Perhatian",
            "Anda harus terhubung dengan jaringan untuk bisa melakukan inspeksi, silahkan login kembali untuk bisa mengakses inspeksi"
          );
        } else {
          router.push(`/page/${link}`);
        }
      }
    };
    onMounted(async () => {
      checkPlatform();
      offline_data.value = await dataServices.getData("Hazop");
      const connection = ls.get("mode", { decrypt: true });
      console.log(connection);
      mode.value = connection;
      if (connection == "online") {
        loadDataEmployee();
      } else {
        alertV("Perhatian!", "Sekarang anda menggunakan mode Offline");
      }
      setInterval(() => {
        if (router.currentRoute.value.name == "home") {
          showTabBar();
        }
      }, 500);
    });

    const loadDataEmployee = async () => {
      const token = ls.get("token", { decrypt: true });
      try {
        const result = await axios.get(`/Api/General/GetUserInformation`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (result.status == 200) {
          employee.value = result.data[0];
          ls.set("EmployeeCode", result.data[0].Code, { encrypt: true });
        } else {
          tokenExpired("Session has expired...");
        }
      } catch {
        CheckConnection();
      }
    };

    const checkPlatform = () => {
      const platform = Capacitor.getPlatform();
      if (platform == "ios") {
        title.value = "B B S P";
        subTitle.value = "Behavior Based Safety Program";
      } else {
        title.value = "S A P";
        subTitle.value = "Safety Accountability Program";
      }
    };

    onUpdated(async () => {
      offline_data.value = await dataServices.getData("Hazop");
    });

    const modalCs = async () => {
      const modal = await modalController.create({
        component: ModalCs,
        cssClass: "transparent-modal",
      });
      return modal.present();
    };

    async function uploadOfflineHazop() {
      if (mode.value == "offline") {
        alertV(
          "Perhatian",
          "Anda sekarang terdeteksi menggunakan mode offline, silahkan login kembali untuk melakukan upload hazard report"
        );
      } else {
        const modal = await modalController.create({
          component: ModalHazop,
          breakpoints: [0, 1],
          initialBreakpoint: 1,
        });
        modal.present();
        const { role } = await modal.onWillDismiss();
        console.log(role);
        if (role === "close") {
          offline_data.value = await dataServices.getData("Hazop");
        }
      }
    }

    return {
      toNavigate,
      menuList,
      mode,
      offline_data,
      warningOutline,
      uploadOfflineHazop,
      title,
      subTitle,
      employee,
    };
  },
});
</script>

<style>
ion-content.home-page {
  --background: #f9f9ff;
}
</style>
