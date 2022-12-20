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
        <ion-title>Submit Hazop Report</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content
      style="--padding-start: 10px; --padding-end: 10px; --padding-top: 10px"
      class="submit-hazop"
    >
      <ion-card
        v-for="(data, index) in listData"
        :key="index"
        style="margin-bottom: 25px"
      >
        <ion-item lines="none">
          <ion-label>Nama Pelapor</ion-label>
        </ion-item>
        <ion-item>
          <ion-input
            placeholder="Your name"
            :value="data.Pelapor"
            readonly
          ></ion-input>
        </ion-item>
        <ion-item lines="none">
          <ion-label>Jabatan</ion-label>
        </ion-item>
        <ion-item>
          <ion-input
            placeholder="Your name"
            :value="data.Position"
            readonly
          ></ion-input>
        </ion-item>
        <ion-item lines="none">
          <ion-label>NIK Karyawan</ion-label>
        </ion-item>
        <ion-item>
          <ion-input
            placeholder="Your name"
            :value="data.EmployeeCode"
            readonly
          ></ion-input>
        </ion-item>
        <ion-item lines="none">
          <ion-label>Bahaya yang dilaporkan</ion-label>
        </ion-item>
        <ion-item>
          <ion-input
            placeholder="Your name"
            :value="data.ReportHazard"
            readonly
          ></ion-input>
        </ion-item>
        <ion-item lines="none" style="border-bottom: 1px solid #eeeee4">
          <ion-label>Telah dilaksanakan</ion-label>
          <ion-checkbox
            slot="end"
            :checked="data.IsRepaired == '1'"
            style="margin-right: 20px"
          ></ion-checkbox>
        </ion-item>
        <ion-item lines="none">
          <ion-label>
            Upload Foto (apabila ada) <br />
            <span style="font-size: 16px; color: red">Max 4Mb (img/*)</span>
          </ion-label>
        </ion-item>
        <ion-item lines="none" style="border-bottom: 1px solid #eeeee4">
          <input
            id="fileF"
            type="file"
            accept="image/*"
            multiple
            @change.prevent="handleFileUpload($event)"
          />
        </ion-item>
        <div style="text-align: center; padding: 10px 0">
          <ion-button
            @click="submitButton(data, index)"
            style="width: 40%"
            color="primary"
          >
            Submit
          </ion-button>
        </div>
      </ion-card>
      <ion-loading
        mode="ios"
        :is-open="loading"
        message="Please wait..."
        spinner="crescent"
      >
      </ion-loading>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  modalController,
  IonIcon,
  IonCard,
  IonCheckbox,
  alertController,
  IonLoading,
} from "@ionic/vue";
import axios from "axios";
import { close } from "ionicons/icons";
import { defineComponent, onMounted, ref } from "vue";
import { toastV, alertV } from "../composables/alerts";
import dataServices from "../services/storage";
import ls from "localstorage-slim";

export default defineComponent({
  name: "Modal-Hazop",
  components: {
    IonPage,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonItem,
    IonLabel,
    IonInput,
    IonIcon,
    IonCard,
    IonCheckbox,
    IonLoading,
  },
  setup() {
    const fileF = ref();
    const listData = ref();
    const fileUpload = ref(null);
    const loading = ref(false);
    onMounted(async () => {
      listData.value = await dataServices.getData("Hazop");
    });
    function cancel() {
      return modalController.dismiss(null, "close");
    }

    function handleFileUpload(e) {
      console.log(e.target.files);
      fileUpload.value = e.target.files;
    }

    // async function getToken() {
    //   const users = new FormData();
    //   users.append("user", "aldo.ep");
    //   users.append("password", "aldo19");
    //   try {
    //     const res = await axios.post("https://192.168.1.24/Auth/Token", users);
    //     console.log(res);
    //     if (res.status == 200) {
    //       return res.data;
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }

    async function submitButton(data, index) {
      console.log(data);
      if (fileUpload.value.length > 0) {
        sendDataHazop(data, index);
      } else {
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "Confirm!",
          mode: "ios",
          message: "<strong>Submit tanpa Upload Foto??</strong>",
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
              text: "Confirm",
              id: "confirm-button",
              handler: async () => {
                sendDataHazop(data, index);
              },
            },
          ],
        });
        alert.present();
      }
    }

    async function sendDataHazop(data, index) {
      const token = ls.get("token", { decrypt: true });
      console.log(data);
      console.log(index);
      loading.value = true;
      console.log(fileUpload.value);
      if (fileUpload.value.length > 0) {
        const formData = new FormData();
        formData.append("ReporterName", data.Pelapor);
        formData.append("EmployeeCode", data.EmployeeCode);
        formData.append("ReportDate", data.ReportDate);
        formData.append("Department", data.Department);
        formData.append("Position", data.Position);
        formData.append("ReportHazard", data.ReportHazard);
        formData.append("Location", data.Location);
        formData.append("TemporaryAction", data.TemporaryAction);
        formData.append("Action", data.Action);
        formData.append("IsRepaired", data.IsRepaired == true ? 1 : 0);
        for (const i of Object.keys(fileUpload.value)) {
          formData.append("Files", fileUpload.value[i]);
        }
        try {
          const response = await axios.post(
            `/Api/SAP/ReceiveDataHazardReport/`,
            formData,
            {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
                "Access-Control-Allow-Headers":
                  "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + token,
              },
            }
          );
          console.log(response);
          if (response.data == "Success") {
            toastV("Hazop Report berhasil di upload ke server", "success");
            dataServices.removeData("Hazop", index);
            listData.value.splice(index, 1);
            setTimeout(() => {
              if (listData.value.length == 0) {
                return modalController.dismiss(null, "close");
              }
            }, 500);
            fileUpload.value = null;
            const d = document.getElementById("fileF");
            d.value = null;
            loading.value = false;
          } else {
            loading.value = false;
            toastV(
              "Hazop Report gagal di upload ke server, Ukuran foto melebihi 4Mb",
              "danger"
            );
          }
        } catch (error) {
          loading.value = false;
          alertV("Error", error);
        }
      } else {
        const formData = new FormData();
        formData.append("ReporterName", data.Pelapor);
        formData.append("EmployeeCode", data.EmployeeCode);
        formData.append("ReportDate", data.ReportDate);
        formData.append("Department", data.Department);
        formData.append("Position", data.Position);
        formData.append("ReportHazard", data.ReportHazard);
        formData.append("Location", data.Location);
        formData.append("TemporaryAction", data.TemporaryAction);
        formData.append("Action", data.Action);
        formData.append("IsRepaired", data.IsRepaired == true ? 1 : 0);
        formData.append("Files", fileUpload.value);
        try {
          const response = await axios.post(
            `/Api/SAP/ReceiveDataHazardReport/`,
            formData,
            {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
                "Access-Control-Allow-Headers":
                  "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + token,
              },
            }
          );
          console.log(response);
          if (response.data == "Success") {
            toastV("Hazop Report berhasil di upload ke server", "success");
            dataServices.removeData("Hazop", index);
            listData.value.splice(index, 1);
            setTimeout(() => {
              if (listData.value.length == 0) {
                return modalController.dismiss(null, "close");
              }
            }, 500);
            fileUpload.value = null;
            const d = document.getElementById("fileF");
            d.value = null;
            loading.value = false;
          } else {
            loading.value = false;
            toastV(
              "Hazop Report gagal di upload ke server, Ukuran foto melebihi 4Mb",
              "danger"
            );
          }
        } catch (error) {
          loading.value = false;
          alertV("Error", error);
        }
      }
    }
    return {
      fileF,
      loading,
      listData,
      close,
      cancel,
      submitButton,
      handleFileUpload,
      sendDataHazop,
    };
  },
});
</script>
<style>
.submit-hazop ion-label {
  font-size: 1.3rem !important;
  font-weight: 600;
}
.submit-hazop ion-input {
  font-size: 1.2rem;
}
</style>
