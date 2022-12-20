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
        <ion-title>Detail Hazop</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="detail-hazop ion-padding">
      <ion-card v-for="detail in dataDetail" :key="detail.Oid">
        <ion-grid :fixed="true" style="padding: 10px">
          <ion-row>
            <ion-col class="title">Document No.</ion-col>
            <ion-col size="auto">:</ion-col>
            <ion-col>{{ detail.ReportNo }}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col class="title">Tanggal Report</ion-col>
            <ion-col size="auto">:</ion-col>
            <ion-col>{{ GetFullDate(detail.ReportDate) }}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col class="title">Laporan Bahaya</ion-col>
            <ion-col size="auto">:</ion-col>
            <ion-col>{{ detail.ReportHazard }}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col class="title">Status Perbaikan</ion-col>
            <ion-col size="auto">:</ion-col>
            <ion-col>
              <img
                v-if="detail.IsRepaired"
                :src="require(`../assets/icons/check.png`)"
                alt=""
              />
              <img
                v-if="!detail.IsRepaired"
                :src="require(`../assets/icons/crossed.png`)"
                alt=""
              />
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col class="title">Status Assesment</ion-col>
            <ion-col size="auto">:</ion-col>
            <ion-col>
              <img
                v-if="detail.StatusAssesment"
                :src="require(`../assets/icons/check.png`)"
                alt=""
              />
              <img
                v-if="!detail.StatusAssesment"
                :src="require(`../assets/icons/crossed.png`)"
                alt=""
              />
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col class="title">Status Report</ion-col>
            <ion-col size="auto">:</ion-col>
            <ion-col>
              <img
                v-if="detail.StatusReport"
                :src="require(`../assets/icons/check.png`)"
                alt=""
              />
              <img
                v-if="!detail.StatusReport"
                :src="require(`../assets/icons/crossed.png`)"
                alt=""
              />
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-label class="title">Tindakan sementara</ion-label> <br />
              <ion-label class="text-area">
                {{ detail.TemporaryAction }}
              </ion-label>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-label class="title">Tindakan Pencegahan</ion-label> <br />
              <ion-label class="text-area">
                {{ detail.Action }}
              </ion-label>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { formatDateYYYYMMDD, GetFullDate } from "../composables/composables";
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
  IonLabel,
} from "@ionic/vue";
export default defineComponent({
  name: "ListHazop",
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
    IonLabel,
  },
  setup() {
    const dataDetail = ref();

    onMounted(async () => {
      const detail = await dataServices.getData("listDetailHazop");
      if (detail) {
        dataDetail.value = detail;
      }
    });
    function cancel() {
      return modalController.dismiss(null, "close");
    }
    return {
      dataDetail,
      cancel,
      formatDateYYYYMMDD,
      GetFullDate,
      close,
    };
  },
});
</script>

<style>
ion-content.detail-hazop {
  --background: #f9f9ff;
}
.detail-hazop ion-row:nth-child(odd) {
  background-color: #ededed;
  color: black;
}
.detail-hazop ion-col,
.detail-hazop ion-col ion-label.text-area {
  font-size: 1.1rem;
  text-align: justify;
  color: black;
}
.detail-hazop ion-col ion-label.title {
  font-weight: 600;
  display: flex;
  margin-top: 10px;
  justify-content: center;
  font-size: 1.2rem;
  color: black;
}
.detail-hazop ion-col.title {
  font-weight: 600;
  text-align: justify;
  color: black;
}
.detail-hazop ion-col img {
  width: 25px;
}
</style>
