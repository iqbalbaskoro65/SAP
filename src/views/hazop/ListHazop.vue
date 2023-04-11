<template>
  <ion-page>
    <ion-header mode="ios">
      <ion-toolbar>
        <ion-back-button default-href="/" slot="start" />
        <ion-title>Riwayat Data Hazop</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="list-hazop ion-padding">
      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content refreshing-text="Refreshing...">
        </ion-refresher-content>
      </ion-refresher>
      <div class="period-list">
        <ion-label class="period-title"> Periode </ion-label>
        <ion-segment value="awal" mode="ios">
          <ion-segment-button value="awal" id="awal">
            <ion-label>Tanggal Awal</ion-label>
            <ion-input readonly v-model="startDate"></ion-input>
            <ion-popover
              mode="ios"
              trigger="awal"
              @didDismiss="checkDateRange()"
            >
              <ion-datetime
                @ionChange="awalDateTime()"
                presentation="date"
                v-model="tempInput.startDate"
              />
            </ion-popover>
          </ion-segment-button>
          <ion-segment-button value="akhir" id="akhir">
            <ion-label>Tanggal Akhir</ion-label>
            <ion-input readonly v-model="endDate"></ion-input>
            <ion-popover
              mode="ios"
              trigger="akhir"
              @didDismiss="checkDateRange()"
            >
              <ion-datetime
                @ionChange="akhirDateTime()"
                presentation="date"
                v-model="tempInput.endDate"
              />
            </ion-popover>
          </ion-segment-button>
        </ion-segment>
      </div>
      <div style="text-align: center; padding-top: 20px">
        <ion-label style="color: black; font-size: 1.2rem; font-weight: 600">
          Total Data :
          <span style="color: red">{{ dataSUM }}</span>
        </ion-label>
      </div>
      <div v-if="!noData">
        <ion-card
          v-for="item in listData"
          :key="item.Oid"
          @click.prevent="reportDetail(item)"
        >
          <ion-grid :fixed="true" style="padding: 10px">
            <ion-row>
              <ion-col class="title">Document No.</ion-col>
              <ion-col size="auto">:</ion-col>
              <ion-col>{{ item.ReportNo }}</ion-col>
            </ion-row>
            <ion-row>
              <ion-col class="title">Tanggal Report</ion-col>
              <ion-col size="auto">:</ion-col>
              <ion-col>{{ GetFullDate(item.ReportDate) }}</ion-col>
            </ion-row>
            <ion-row>
              <ion-col class="title">Laporan Bahaya</ion-col>
              <ion-col size="auto">:</ion-col>
              <ion-col>{{ item.ReportHazard }}</ion-col>
            </ion-row>
            <ion-row>
              <ion-col class="title">Status Perbaikan</ion-col>
              <ion-col size="auto">:</ion-col>
              <ion-col>
                <img
                  v-if="item.IsRepaired"
                  :src="require(`../../assets/icons/check.png`)"
                  alt=""
                />
                <img
                  v-if="!item.IsRepaired"
                  :src="require(`../../assets/icons/crossed.png`)"
                  alt=""
                />
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col class="title">Status Assesment</ion-col>
              <ion-col size="auto">:</ion-col>
              <ion-col>
                <img
                  v-if="item.StatusAssesment"
                  :src="require(`../../assets/icons/check.png`)"
                  alt=""
                />
                <img
                  v-if="!item.StatusAssesment"
                  :src="require(`../../assets/icons/crossed.png`)"
                  alt=""
                />
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card>
      </div>
      <div v-if="noData" style="text-align: center; margin-top: 10px">
        <img :src="require(`../../assets/img/notfound.png`)" alt="" />
      </div>
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
import ls from "localstorage-slim";
import dataServices from "../../services/storage";
import { defineComponent, onMounted, reactive, ref } from "vue";
import { tokenExpired, toastV } from "../../composables/alerts";
import { formatDateYYYYMMDD, GetFullDate } from "../../composables/composables";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonContent,
  IonLoading,
  IonRefresher,
  IonRefresherContent,
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonInput,
  IonPopover,
  IonDatetime,
  modalController,
} from "@ionic/vue";
import axios from "axios";
// modal
import modalDetail from "../../components/DetailHazop.vue";
export default defineComponent({
  name: "ListHazop",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonBackButton,
    IonContent,
    IonLoading,
    IonRefresher,
    IonRefresherContent,
    IonCard,
    IonGrid,
    IonRow,
    IonCol,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonInput,
    IonPopover,
    IonDatetime,
  },
  setup() {
    const loading = ref(true);
    const employee = ref();
    const startDate = ref();
    const endDate = ref();
    const tempInput = reactive({
      startDate: null,
      endDate: null,
    });
    const listData = ref();
    const dataSUM = ref();
    const noData = ref();

    // async function getToken() {
    //   const users = new FormData();
    //   users.append("user", "aldo.ep");
    //   users.append("password", "aldo19");
    //   try {
    //     const res = await axios.post("https://192.168.1.19/Auth/Token", users);
    //     if (res.status == 200) {
    //       return res.data;
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }

    onMounted(() => {
      const token = ls.get("token", { decrypt: true });
      takeDateRange();
      loadEmployee(token);
    });

    const doRefresh = (event) => {
      const token = ls.get("token", { decrypt: true });
      setTimeout(() => {
        takeDateRange();
        loadEmployee(token);
        setTimeout(() => {
          event.target.complete();
        }, 500);
      }, 1500);
    };

    function addMonths(date, months) {
      var d = date.getDate();
      date.setMonth(date.getMonth() + +months);
      if (date.getDate() != d) {
        date.setDate(0);
      }
      return date;
    }

    const takeDateRange = () => {
      var date1 = "";
      var date2 = "";
      var date = new Date();
      if (date.getDate() >= 26) {
        date1 =
          date.getFullYear() +
          "-" +
          ("00" + (date.getMonth() + 1)).slice(-2) +
          "-" +
          "26";
      } else {
        let dates = new Date(
          addMonths(
            new Date(date.getFullYear(), date.getMonth(), 26),
            -1
          ).toString()
        );
        date1 =
          dates.getFullYear() +
          "-" +
          String(dates.getMonth() + 1).padStart(2, "0") +
          "-" +
          "26";
      }
      date2 =
        date.getFullYear() +
        "-" +
        ("00" + (date.getMonth() + 1)).slice(-2) +
        "-" +
        ("00" + date.getDate()).slice(-2);
      startDate.value = date1;
      endDate.value = date2;
    };

    const checkDateRange = () => {
      console.log(startDate.value);
      console.log(endDate.value);
      const token = ls.get("token", { decrypt: true });

      if (startDate.value > endDate.value) {
        toastV(
          "Tanggal awal tidak boleh lebih besar dari Tanggal Akhir",
          "danger"
        );
      } else {
        if (tempInput.startDate != null || tempInput.endDate != null) {
          loading.value = true;
          loadData(token);
        }
      }
    };

    const loadEmployee = async (token) => {
      try {
        const result = await axios.get(`/Api/General/GetUserInformation`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (result.status == 200) {
          employee.value = result.data[0];
          loadData(token);
        } else {
          loading.value = false;
          tokenExpired("Session has expired...");
        }
      } catch (error) {
        loading.value = false;
        tokenExpired(error.code);
      }
    };

    const loadData = async (token) => {
      const sendData = {
        EmployeeCode: employee.value.Code,
        DateFrom: startDate.value,
        DateTo: endDate.value,
      };
      try {
        const res = await axios.post("/Api/SAP/GetHazopHistory", sendData, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
            "Access-Control-Allow-Headers":
              "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        console.log(res);
        if (res.status == 200) {
          if (res.data.length > 0) {
            loading.value = false;
            noData.value = false;
            listData.value = res.data;
            dataSUM.value = res.data.length;
          } else {
            loading.value = false;
            dataSUM.value = res.data.length;
            noData.value = true;
          }
        } else {
          loading.value = false;
          tokenExpired("Session has expired...");
        }
      } catch (error) {
        loading.value = false;
        tokenExpired(error.code);
      }
    };

    const awalDateTime = () => {
      if (tempInput.startDate != null) {
        startDate.value = formatDateYYYYMMDD(tempInput.startDate);
      }
    };
    const akhirDateTime = () => {
      if (tempInput.endDate != null) {
        endDate.value = formatDateYYYYMMDD(tempInput.endDate);
      }
    };

    const reportDetail = async (item) => {
      const detail = await dataServices.getData("listDetailHazop");
      if (detail) {
        await dataServices.clearData("listDetailHazop");
      }
      const sendData = {
        ReportNo: item.ReportNo,
        ReportDate: item.ReportDate,
        ReportHazard: item.ReportHazard,
        TemporaryAction: item.TemporaryAction,
        Action: item.Action,
        IsRepaired: item.IsRepaired,
        StatusAssesment: item.StatusAssesment,
        StatusReport: item.StatusReport,
      };
      await dataServices.addData("listDetailHazop", sendData);
      const modal = await modalController.create({
        component: modalDetail,
        breakpoints: [0, 1],
        initialBreakpoint: 1,
      });
      modal.present();
      const { role } = await modal.onWillDismiss();
      console.log(role);
    };

    return {
      listData,
      noData,
      dataSUM,
      checkDateRange,
      reportDetail,
      tempInput,
      startDate,
      endDate,
      loading,
      doRefresh,
      awalDateTime,
      GetFullDate,
      akhirDateTime,
    };
  },
});
</script>

<style>
ion-content.list-hazop {
  --background: #f9f9ff;
}
.list-hazop ion-row:nth-child(odd) {
  background-color: #ededed;
  color: black;
}
.list-hazop ion-col {
  font-size: 1.1rem;
  text-align: center;
  color: black;
}
.list-hazop ion-col.title {
  font-weight: 600;
  text-align: justify;
  color: black;
}
.list-hazop ion-col img {
  width: 25px;
}
.list-hazop .period-list {
  color: black;
  padding: 0 15px;
}
.list-hazop .period-list ion-label.period-title {
  display: flex;
  justify-content: center;
  font-weight: 600;
  font-size: 1.5rem;
  margin-bottom: 5px;
}
.list-hazop .period-list ion-segment {
  width: 100%;
  color: black;
}
.list-hazop .period-list ion-segment ion-segment-button {
  padding: 10px;
  padding-bottom: 0;
  color: black;
}
.list-hazop .period-list ion-segment ion-segment-button ion-label {
  font-size: 1.2rem;
}
.list-hazop .period-list ion-segment ion-segment-button ion-input {
  font-size: 1rem;
}
ion-popover {
  --backdrop-opacity: 0.6;
  --box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.6);
  /* --color: white; */
  --width: 350px;
}
</style>
