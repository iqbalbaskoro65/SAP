<template>
  <ion-page ref="page">
    <ion-header :hidden="scanActive" mode="ios">
      <ion-toolbar class="toolbar-high">
        <ion-back-button default-href="/" slot="start" />
        <ion-title>Meeting {{ title }}</ion-title>
        <ion-icon
          @click="uploadData()"
          slot="end"
          style="font-size: 30px; padding-right: 15px"
          :icon="cloudUploadOutline"
        />
      </ion-toolbar>
      <offline-mode></offline-mode>
    </ion-header>
    <ion-content
      class="ion-padding"
      :style="scanActive ? '--background:#00000000' : '--background:#f9f9ff'"
    >
      <div
        style="display: flex; justify-content: center; justify-items: center"
      >
        <ion-button
          class="scanner-buttons"
          expand="block"
          style="
            width: 80%;
            --border-radius: 15px;
            --background: var(--ion-color-primary-shade);
          "
          @click.prevent="startScanner()"
          :hidden="scanActive"
        >
          <ion-icon slot="start" :icon="scanOutline"></ion-icon>
          Mulai Pemindai
        </ion-button>

        <ion-button
          class="scanner-buttons"
          expand="block"
          style="width: 80%; --border-radius: 15px"
          @click.prevent="stopScanner()"
          :hidden="!scanActive"
        >
          <ion-icon slot="start" :icon="closeOutline"></ion-icon>
          Stop Pemindai
        </ion-button>
      </div>
      <div v-if="isResult && !scanActive" class="result ion-padding">
        <img
          :src="require(`../../assets/icons/check.png`)"
          style="width: 70px"
        />
        <p style="margin: 0; font-weight: 600">Check-In Berhasil</p>
        <div class="card-scanner">
          <div class="title">
            <div class="tanggal">
              <ion-icon slot="start" :icon="calendarOutline"></ion-icon>
              {{ fullDate }}
            </div>
            <div class="waktu">
              <ion-icon slot="start" :icon="timeOutline"></ion-icon>
              {{ timeAMPM }}
            </div>
          </div>
          <div class="message">
            {{ noRegister }}
          </div>
          <div class="username">{{ resultBarcode }}</div>
        </div>
      </div>
      <div v-if="!scanActive && isDenied" style="text-align: center">
        <img
          :src="require(`../../assets/icons/remove.png`)"
          style="width: 70%; margin-top: 70px"
        />
        <h2 style="font-weight: 600; color: red">Gagal absensi</h2>
        <h2 style="font-weight: 600; color: red">{{ DeniedMssg }}</h2>
      </div>
      <div class="scan-box" :hidden="!scanActive">
        <div class="title-scan-box" style="color: white">
          <h1 style="font-weight: 600; margin: 0">S A P</h1>
          <p style="margin: 0">
            Arahkan kamera ke QR Code ID Card untuk melakukan pemindaian
          </p>
        </div>
        <div class="laser"></div>
      </div>
      <ion-loading
        mode="ios"
        :is-open="isLoading"
        message="Mohon Tunggu..."
        spinner="crescent"
      >
      </ion-loading>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  alertController,
  IonBackButton,
  IonLoading,
  modalController,
} from "@ionic/vue";
import { defineComponent, onMounted, ref } from "vue";
import {
  scanOutline,
  closeOutline,
  calendarOutline,
  timeOutline,
  checkboxOutline,
  cloudUploadOutline,
} from "ionicons/icons";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";

// composables
import {
  GetFullDate,
  formatAMPM,
  getDateNow,
  getDateTimeNow,
} from "../../composables/composables";
import modalDetail from "../../components/ModalSafetyMeeting.vue";
import { showTabBar, hideTabBar } from "../../composables/hideTabs";

//services database
import dataServices from "../../services/storage";

import ls from "localstorage-slim";
import { Network } from "@capacitor/network";
import { alertV, toastV, tokenExpired } from "../../composables/alerts";
import { useRouter } from "vue-router";
import OfflineMode from "../../components/OfflineMode.vue";
import axios from "axios";

export default defineComponent({
  name: "MeetingV",
  props: {
    title: String,
  },
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonBackButton,
    IonLoading,
    OfflineMode,
  },
  setup(props) {
    const isLoading = ref(false);
    const router = useRouter();
    const resultBarcode = ref(null);
    const scanActive = ref(false);
    const isResult = ref();
    const isDenied = ref();
    const fullDate = ref();
    const timeAMPM = ref();
    const noRegister = ref();
    const DeniedMssg = ref();
    const mode = ref();
    const employe = ref();

    // modal atr

    onMounted(async () => {
      LoadEmp();
      // await dataServices.addData("safety-meeting-general", {
      //   Employee: "Syahbudin",
      //   Inspection: "Mingguan",
      //   NoRegister: "0018/CES-MP/V/2022",
      //   TimeIn: "2022-12-14 16:34:26",
      //   TransDate: "2022-12-14",
      // });
      const conn = ls.get("mode", { decrypt: true });
      mode.value = conn;
      fullDate.value = GetFullDate(new Date());
      timeAMPM.value = formatAMPM(new Date());
      BarcodeScanner.prepare();
      setInterval(() => {
        if (router.currentRoute.value.name == "safety" && !scanActive.value) {
          showTabBar();
        }
      }, 200);
    });

    const LoadEmp = async () => {
      const token = ls.get("token", { decrypt: true });
      try {
        const result = await axios.get(`/Api/HRM/GetEmployee`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (result.status == 200) {
          employe.value = result.data;
        } else {
          tokenExpired("Session has expired...");
        }
      } catch (err) {
        tokenExpired(err.code);
      }
    };

    const checkEmpByCode = (code) => {
      const match = employe.value.find((x) => x.Code == code);
      if (match) {
        return match.Name;
      } else {
        return code;
      }
    };

    async function checkPermission() {
      // eslint-disable-next-line no-async-promise-executor, no-unused-vars
      return new Promise(async (resolve, reject) => {
        const status = await BarcodeScanner.checkPermission({ force: true });
        if (status.granted) {
          resolve(true);
        } else if (status.denied) {
          const alert = await alertController.create({
            mode: "ios",
            header: "Tidak ada akses",
            message: "Mohon izinkan akses kamera di pengaturan Anda",
            buttons: [
              { text: "Tidak", role: "cancel" },
              {
                text: "Buka Pengaturan",
                handler: () => {
                  BarcodeScanner.openAppSettings();
                  resolve(false);
                },
              },
            ],
          });
          await alert.present();
        } else {
          resolve(false);
        }
      });
    }

    async function startScanner() {
      const allowed = await checkPermission();
      if (allowed) {
        resultBarcode.value = null;
        noRegister.value = null;
        scanActive.value = true;
        hideTabBar();
        isResult.value = false;
        isDenied.value = false;
        document.body.classList.add("qrscanner");
        const result = await BarcodeScanner.startScan();
        document.body.classList.remove("qrscanner");
        if (result.hasContent) {
          showTabBar();
          console.log(result);
          setTimeout(() => {
            scanActive.value = false;
            submitAbsent(result.content);
          }, 300);
        }
      }
    }

    async function submitAbsent(result) {
      if (props.title == "Mingguan") {
        const list = await dataServices.getData("safety-meeting-mingguan");
        const status = result.split(":");
        console.log(status);
        if (
          status.length >= 3 &&
          (status[0] == "CHECKIN" || status[0] == "checkin")
        ) {
          if (list == null) {
            await dataServices.addData("safety-meeting-mingguan", {
              TransDate: getDateNow(),
              TimeIn: getDateTimeNow(),
              Inspection: props.title,
              Employee: checkEmpByCode(status[1]),
              EemployeeCode: status[1],
              NoRegister: status[2],
            });
            toastV("Berhasil memindai", "success");
            isResult.value = true;
            resultBarcode.value = checkEmpByCode(status[1]);
            noRegister.value = status[2];
            isDenied.value = false;
          } else {
            const find = list.find(
              (result) =>
                result.TransDate === getDateNow() &&
                result.EemployeeCode === status[1] &&
                result.NoRegister === status[2] &&
                result.Inspection === props.title
            );
            if (find == undefined) {
              await dataServices.addData("safety-meeting-mingguan", {
                TransDate: getDateNow(),
                TimeIn: getDateTimeNow(),
                Inspection: props.title,
                Employee: checkEmpByCode(status[1]),
                EemployeeCode: status[1],
                NoRegister: status[2],
              });
              toastV("Berhasil memindai", "success");
              isResult.value = true;
              resultBarcode.value = checkEmpByCode(status[1]);
              noRegister.value = status[2];
              isDenied.value = false;
            } else {
              isDenied.value = true;
              DeniedMssg.value = "Employee sudah di scan";
              toastV("Pemindaian gagal, Employee sudah absen", "danger");
            }
          }
        } else {
          isDenied.value = true;
          DeniedMssg.value = "QR Code tidak cocok";
          toastV("Pemindaian gagal, QR Code tidak cocok", "danger");
        }
      } else if (props.title == "General") {
        const list = await dataServices.getData("safety-meeting-general");
        const status = result.split(":");
        console.log(status);
        if (
          status.length >= 3 &&
          (status[0] == "CHECKIN" || status[0] == "checkin")
        ) {
          if (list == null) {
            await dataServices.addData("safety-meeting-general", {
              TransDate: getDateNow(),
              TimeIn: getDateTimeNow(),
              Inspection: props.title,
              Employee: checkEmpByCode(status[1]),
              EemployeeCode: status[1],
              NoRegister: status[2],
            });
            toastV("Berhasil memindai", "success");
            isResult.value = true;
            resultBarcode.value = checkEmpByCode(status[1]);
            noRegister.value = status[2];
            isDenied.value = false;
          } else {
            const find = list.find(
              (result) =>
                result.TransDate === getDateNow() &&
                result.EemployeeCode === status[1] &&
                result.NoRegister === status[2] &&
                result.Inspection === props.title
            );
            if (find == undefined) {
              await dataServices.addData("safety-meeting-general", {
                TransDate: getDateNow(),
                TimeIn: getDateTimeNow(),
                Inspection: props.title,
                Employee: checkEmpByCode(status[1]),
                EemployeeCode: status[1],
                NoRegister: status[2],
              });
              toastV("Berhasil memindai", "success");
              isResult.value = true;
              resultBarcode.value = checkEmpByCode(status[1]);
              noRegister.value = status[2];
              isDenied.value = false;
            } else {
              isDenied.value = true;
              DeniedMssg.value = "Employee sudah di scan";
              toastV("Pemindaian gagal, Employee sudah absen", "danger");
            }
          }
        } else {
          isDenied.value = true;
          DeniedMssg.value = "QR Code tidak cocok";
          toastV("Pemindaian gagal, QR Code tidak cocok", "danger");
        }
      }
    }

    async function CheckConnection() {
      const check = await Network.getStatus();
      if (check.connected) {
        return true;
      } else {
        return false;
      }
    }

    const uploadData = async () => {
      if (mode.value == "offline") {
        alertV(
          "Perhatian",
          "Anda sekarang terdeteksi menggunakan mode offline, silahkan login kembali untuk melakukan upload data absensi"
        );
      } else {
        const hasInternet = await CheckConnection();
        console.log(hasInternet);
        if (hasInternet) {
          if (props.title == "Mingguan") {
            const list = await dataServices.getData("safety-meeting-mingguan");
            if (list == null) {
              alertV("Perhatian", "Data Absensi Meeting Mingguan kosong");
            } else {
              const modal = await modalController.create({
                component: modalDetail,
                componentProps: {
                  Category: props.title,
                },
                breakpoints: [0, 1],
                initialBreakpoint: 1,
              });
              modal.present();
              const { role } = await modal.onWillDismiss();
              console.log(role);
              if (role) {
                isResult.value = false;
              }
            }
          } else {
            const list = await dataServices.getData("safety-meeting-general");
            if (list == null) {
              alertV("Perhatian", "Data Absensi Meeting General kosong");
            } else {
              const modal = await modalController.create({
                component: modalDetail,
                componentProps: {
                  Category: props.title,
                },
                breakpoints: [0, 1],
                initialBreakpoint: 1,
              });
              modal.present();
              const { role } = await modal.onWillDismiss();
              console.log(role);
              if (role) {
                isResult.value = false;
              }
            }
          }
        } else {
          alertV(
            "Perhatian",
            "Anda saat ini terdeteksi tidak memiliki jaringan, silahkan periksa jaringan anda"
          );
        }
      }
    };

    function stopScanner() {
      BarcodeScanner.stopScan();
      showTabBar();
      scanActive.value = false;
      isResult.value = false;
    }

    return {
      resultBarcode,
      noRegister,
      scanActive,
      startScanner,
      stopScanner,
      scanOutline,
      closeOutline,
      calendarOutline,
      timeOutline,
      checkboxOutline,
      isResult,
      isDenied,
      fullDate,
      timeAMPM,
      submitAbsent,
      cloudUploadOutline,
      uploadData,
      isLoading,
      DeniedMssg,
    };
  },
});
</script>
<style>
.scan-box .title-scan-box {
  justify-content: center;
  text-align: center;
  margin-top: -180px;
}
.scan-box .title-scan-box h1 {
  padding-bottom: 20px;
}
.scan-box .laser {
  width: 100%;
  /* margin-left: -15%; */
  background-color: red;
  height: 2px;
  position: absolute;
  top: -1%;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px,
    rgba(0, 0, 0, 0.22) 0px 10px 10px;
  z-index: 3;
  -webkit-animation: scanning 3s infinite;
  -moz-animation: scanning 3s infinite;
  animation: scanning 3s infinite;
}

@keyframes scanning {
  50% {
    -webkit-transform: translateY(300px);
    -moz-transform: translateY(300px);
    transform: translateY(300px);
  }
}
</style>
