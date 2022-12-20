<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="cancel()">
            <ion-icon
              style="font-size: 2rem; color: white"
              :icon="close"
            ></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ title }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="detail-SM ion-padding">
      <h2
        style="
          width: fit-content;
          margin: 0 auto;
          margin-top: 10px;
          /* margin-bottom: 25px; */
          text-align: center;
          font-weight: 600;
          border-bottom: 2px solid silver;
        "
      >
        {{ GetFullDate(new Date()) }}
      </h2>
      <ion-card
        v-for="(detail, index) in dataDetail"
        :key="index"
        style="margin-top: 15px"
      >
        <ion-grid :fixed="true" style="padding: 10px">
          <ion-row>
            <ion-col class="title">No. ID Card</ion-col>
            <ion-col size="auto">:</ion-col>
            <ion-col>{{ detail.NoRegister }}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col class="title">Employee</ion-col>
            <ion-col size="auto">:</ion-col>
            <ion-col>{{ detail.Employee }}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col class="title">Waktu Absensi</ion-col>
            <ion-col size="auto">:</ion-col>
            <ion-col>
              {{ formatAMPM(detail.TimeIn) }}
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-card>
      <ion-button
        @click="uploadData()"
        style="
          width: 60%;
          height: 40px;
          margin: 0 auto;
          font-size: 1.2rem;
          margin-top: 20px;
        "
        expand="block"
        shape="round"
        color="primary"
      >
        Upload Data
      </ion-button>

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
import ls from "localstorage-slim";
import { v4 as uuidv4 } from "uuid";
import { defineComponent, onMounted, ref } from "vue";
import {
  getDateTimeNow,
  GetFullDate,
  formatAMPM,
} from "../composables/composables";
import { toastV } from "../composables/alerts";
import dataServices from "../services/storage";
import { close } from "ionicons/icons";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonButtons,
  IonButton,
  modalController,
  alertController,
  IonLoading,
} from "@ionic/vue";
import { alertV } from "../composables/alerts";
import axios from "axios";
export default defineComponent({
  name: "ModalSM",
  props: {
    Category: { default: "Super Modal" },
  },
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonButtons,
    IonButton,
    IonLoading,
  },
  setup(props) {
    const dataDetail = ref([]);
    const title = ref();
    const isLoading = ref(false);

    // async function getToken() {
    //   const users = new FormData();
    //   users.append("user", "aldo.ep");
    //   users.append("password", "aldo19");
    //   try {
    //     const res = await axios.post("https://192.168.1.17/Auth/Token", users);
    //     console.log(res);
    //     if (res.status == 200) {
    //       return res.data;
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }

    onMounted(async () => {
      if (props.Category == "Mingguan") {
        title.value = "Meeting Mingguan";
        const detail = await dataServices.getData("safety-meeting-mingguan");
        console.log(detail);
        dataDetail.value = detail;
      } else if (props.Category == "General") {
        title.value = "Meeting General";
        const detail = await dataServices.getData("safety-meeting-general");
        console.log(detail);
        dataDetail.value = detail;
      }
    });

    const uploadData = async () => {
      const alert = await alertController.create({
        header: "Mohon lengkapi data berikut :",
        inputs: [
          {
            name: "materi",
            placeholder: "Materi",
            type: "text",
          },
          {
            name: "pemateri",
            placeholder: "Nama Pemateri",
            type: "text",
          },
          {
            name: "lokasi",
            placeholder: "Lokasi",
            type: "text",
          },
          {
            name: "remark",
            type: "textarea",
            placeholder: "Remarks",
          },
        ],
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
            handler: () => {
              console.log("Confirm Cancel");
            },
          },
          {
            text: "Ok",
            handler: (alertData) => {
              //takes the data
              if (alertData.materi == "") {
                toastV("Materi tidak boleh kosong", "danger");
                return false;
              } else {
                if (alertData.pemateri == "") {
                  toastV("Nama Pemateri tidak boleh kosong", "danger");
                  // uploadData();
                  return false;
                } else {
                  if (alertData.lokasi == "") {
                    toastV("Lokasi tidak boleh kosong", "danger");
                    return false;
                    // uploadData();
                  } else {
                    if (alertData.remark == "") {
                      toastV("Remaks tidak boleh kosong", "danger");
                      return false;
                      // uploadData();
                    } else {
                      isLoading.value = true;
                      const sendData = {
                        MeetingMateri: alertData.materi,
                        MeetingSpeaker: alertData.pemateri,
                        MeetingLocation: alertData.lokasi,
                        Remarks: alertData.remark,
                      };
                      submitData(sendData);
                    }
                  }
                }
              }
            },
          },
        ],
      });

      await alert.present();
    };

    const submitData = async (data) => {
      // const token = await getToken();
      const token = ls.get("token", { decrypt: true });
      const sendData = [
        {
          Oid: uuidv4(),
          MeetingCategory: props.Category == "Mingguan" ? 0 : 1,
          MeetingInput: ls.get("EmployeeCode", { decrypt: true }),
          MeetingDate: getDateTimeNow(),
          MeetingSpeaker: data.MeetingSpeaker,
          MeetingLocation: data.MeetingLocation,
          MeetingMateri: data.MeetingMateri,
          Remarks: data.Remarks,
          SafetyMeetingDetail: [],
        },
      ];
      if (props.Category == "Mingguan") {
        const detail = await dataServices.getData("safety-meeting-mingguan");
        const map = detail.map((val) => ({
          CardNumber: val.NoRegister,
          AttendanceDate: val.TimeIn,
          // ParticipantName: val.Employee,
          // EmployeeCode: val.Employee,
        }));
        map.forEach((el) => {
          sendData[0].SafetyMeetingDetail.push(el);
        });
        console.log(sendData);

        try {
          const res = await axios.post(
            "/Api/SAP/ReceiveSafetyMeetingData",
            sendData,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          console.log(res);
          if (res.status == 200) {
            isLoading.value = false;
            await dataServices.clearData("safety-meeting-mingguan");
            toastV(
              "Data absensi meeting mingguan berhasil disimpan ke server",
              "success"
            );
            checkData();
          } else {
            isLoading.value = false;
            alertV(
              "ERROR",
              "Data absensi meeting mingguan gagal di upload ke server"
            );
          }
        } catch (error) {
          isLoading.value = false;
          alertV("ERROR", error.code);
        }
      } else {
        const detail = await dataServices.getData("safety-meeting-general");
        const map = detail.map((val) => ({
          CardNumber: val.NoRegister,
          AttendanceDate: val.TimeIn,
          // ParticipantName: val.Employee,
        }));
        map.forEach((el) => {
          sendData[0].SafetyMeetingDetail.push(el);
        });
        console.log(sendData);

        try {
          const res = await axios.post(
            "/Api/SAP/ReceiveSafetyMeetingData",
            sendData,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          console.log(res);
          if (res.status == 200) {
            isLoading.value = false;
            await dataServices.clearData("safety-meeting-general");
            toastV(
              "Data absensi meeting general berhasil disimpan ke server",
              "success"
            );
            checkData();
          } else {
            isLoading.value = false;
            alertV(
              "ERROR",
              "Data absensi meeting general gagal di upload ke server"
            );
          }
        } catch (error) {
          isLoading.value = false;
          alertV("ERROR", error.code);
        }
      }
    };

    const checkData = async () => {
      if (props.Category == "Mingguan") {
        const detail = await dataServices.getData("safety-meeting-mingguan");
        console.log(detail);
        if (detail == null) {
          return modalController.dismiss(null, "close");
        }
      } else {
        const detail = await dataServices.getData("safety-meeting-general");
        console.log(detail);
        if (detail == null) {
          return modalController.dismiss(null, "close");
        }
      }
    };

    function cancel() {
      return modalController.dismiss(null, "close");
    }
    return {
      dataDetail,
      cancel,
      getDateTimeNow,
      GetFullDate,
      close,
      formatAMPM,
      title,
      uploadData,
      isLoading,
    };
  },
});
</script>

<style>
ion-content.detail-SM {
  --background: #f9f9ff;
}
.detail-SM ion-row:nth-child(odd) {
  background-color: #ededed;
  color: black;
}
.detail-SM ion-col {
  font-size: 1.1rem;
  color: black;
}
.detail-SM ion-col.title {
  font-weight: 600;
  text-align: justify;
  color: black;
}
</style>
