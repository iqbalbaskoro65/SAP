<template>
  <ion-page>
    <ion-header mode="ios">
      <ion-toolbar>
        <ion-back-button default-href="/" slot="start" />
        <ion-title>Inspeksi</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="pilih-inspeksi ion-padding">
      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content refreshing-text="Refreshing...">
        </ion-refresher-content>
      </ion-refresher>
      <ion-card>
        <ion-card-header style="text-align: center">
          <ion-card-title> Pilih Jenis Inspeksi </ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-select
            v-if="connection == 'online'"
            class="select-option"
            interface="action-sheet"
            placeholder="Inspeksi"
            mode="ios"
            v-model="selectedInspection"
          >
            <ion-select-option
              v-for="inspection in inspectionList"
              :key="inspection.Oid"
              :value="inspection"
            >
              {{ inspection.Name }}
            </ion-select-option>
          </ion-select>
          <ion-select
            v-if="connection == 'offline'"
            class="select-option"
            interface="action-sheet"
            placeholder="Inspeksi"
            mode="ios"
            v-model="selectedInspection"
          >
            <ion-select-option
              v-for="inspection in inspectionList"
              :key="inspection.Oid"
              :value="inspection"
            >
              {{ inspection.Name }}
            </ion-select-option>
          </ion-select>
          <div
            v-if="selectedInspection"
            class="animate__animated animate__fadeIn animate__slower"
          >
            <ion-list lines="none">
              <ion-item>
                <ion-label position="floating">Tanggal Inspeksi</ion-label>
                <ion-input type="date" :value="inspectionDate" readonly />
              </ion-item>
            </ion-list>
            <ion-list lines="none">
              <ion-item>
                <ion-label position="floating">Inspektor</ion-label>
                <ion-input type="text" :value="employee.Name" readonly />
              </ion-item>
            </ion-list>
            <ion-list lines="none">
              <ion-item>
                <ion-label position="floating">NIK</ion-label>
                <ion-input type="number" :value="employee.Code" readonly />
              </ion-item>
            </ion-list>
            <ion-list lines="none">
              <ion-item>
                <ion-label position="floating">
                  Lokasi <span style="color: red">*</span>
                </ion-label>
                <ion-input
                  type="text"
                  v-model="inspectionLocation"
                  placeholder="Masukkan Lokasi"
                />
                <ion-note
                  style="margin-top: 35px"
                  slot="end"
                  v-if="v$.inspectionLocation.$error && !isSave"
                >
                  {{ v$.inspectionLocation.$errors[0].$message }}
                </ion-note>
              </ion-item>
            </ion-list>
          </div>
          <div style="margin: 0 auto; text-align: center">
            <ion-button
              @click.prevent="submitJenis(employee)"
              style="width: fit-content"
              size="medium"
              fill="outline"
            >
              Lanjutkan
            </ion-button>
          </div>
        </ion-card-content>
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
import { defineComponent, onMounted, ref } from "vue";
import dataServices from "../../services/storage";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonList,
  IonItem,
  IonLabel,
  IonLoading,
  IonRefresher,
  IonNote,
  IonRefresherContent,
} from "@ionic/vue";
import { alertV, toastV, tokenExpired } from "../../composables/alerts";
import { getDateNow } from "../../composables/composables";
import { useRouter } from "vue-router";
import { chevronDownCircleOutline } from "ionicons/icons";
import axios from "axios";
import ls from "localstorage-slim";
// validasi
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { computed } from "@vue/reactivity";
export default defineComponent({
  name: "InspeksiView",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonBackButton,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonList,
    IonItem,
    IonLabel,
    IonLoading,
    IonRefresher,
    IonRefresherContent,
    IonNote,
  },
  setup() {
    const employee = ref([]);
    const selectedInspection = ref();
    const inspectionDate = ref();
    const router = useRouter();
    const inspectionList = ref([]);
    const loading = ref(true);
    const inspectionLocation = ref();
    const connection = ref();
    const isSave = ref();

    const rules = computed(() => ({
      inspectionLocation: { required },
    }));
    const v$ = useVuelidate(rules, {
      inspectionLocation,
    });

    const doRefresh = (event) => {
      setTimeout(() => {
        const token = ls.get("token", { decrypt: true });
        const mode = ls.get("mode", { decrypt: true });
        if (mode == "online") {
          loadData(token);
        }
        setTimeout(() => {
          event.target.complete();
        }, 500);
      }, 1500);
    };

    onMounted(async () => {
      inspectionDate.value = getDateNow();
      const token = ls.get("token", { decrypt: true });
      const mode = ls.get("mode", { decrypt: true });
      connection.value = mode;
      if (mode == "online") {
        loadData(token);
      } else {
        getInspectionCatOffline();
      }
    });

    // async function getToken() {
    //   const params = new FormData();
    //   params.append("user", "aldo.ep");
    //   params.append("password", "aldo19");
    //   try {
    //     const res = await axios.post("https://192.168.1.16/Auth/Token", params);
    //     return res.data;
    //   } catch (error) {
    //     console.log(error.code);
    //   }
    // }

    async function getInspectionCatOffline() {
      const category = await dataServices.getData("InspectionCategory");
      if (category) {
        console.log(category[0]);
      }
    }
    const getInspectionCategory = async (token) => {
      dataServices.clearData("InspectionCategory");
      try {
        const res = await axios.get("/Api/SAP/GetInspectionCategory", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        console.log(res);
        if (res.data.length > 0) {
          loading.value = false;
          const filtered = res.data.filter((x) => {
            return x.Active == true;
          });
          inspectionList.value = filtered;
          dataServices.addData("InspectionCategory", filtered);
        } else {
          loading.value = false;
          alertV("Perhatian", "Kategori Inspeksi kosong!");
        }
      } catch (error) {
        loading.value = false;
        tokenExpired(error.code);
      }
    };

    async function loadData(token) {
      try {
        const result = await axios.get(`/Api/General/GetUserInformation`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (result.status == 200) {
          employee.value = result.data[0];
          getInspectionCategory(token);
        } else {
          loading.value = false;
          tokenExpired("Session has expired...");
        }
      } catch (error) {
        loading.value = false;
        tokenExpired(error.code);
      }
    }

    async function submitJenis(employee) {
      isSave.value = false;
      console.log(employee);
      if (selectedInspection.value) {
        this.v$.$validate();
        if (!this.v$.$error) {
          toastV(
            `Berhasil memilih ${selectedInspection.value.Name}`,
            "success"
          );
          const formData = new FormData();
          formData.append("InspectionDate", inspectionDate.value);
          formData.append("Inspector", employee.Name);
          formData.append("InspectorCode", employee.Code);
          formData.append("InspectorPosition", employee.Position);
          formData.append("Department", employee.Department);
          formData.append("Location", inspectionLocation.value);
          const formData2 = new FormData();
          formData2.append("Oid", selectedInspection.value.Oid);
          formData2.append("Name", selectedInspection.value.Name);
          formData2.append("Active", selectedInspection.value.Active);
          const dataInspektor = dataServices.getData("InspectorData");
          const dataCategoriInspeksi =
            dataServices.getData("SelectedInspection");
          if (dataInspektor) {
            await dataServices.clearData("InspectorData");
          }
          if (dataCategoriInspeksi) {
            await dataServices.clearData("SelectedInspection");
          }
          dataServices.addData("InspectorData", Object.fromEntries(formData));
          dataServices.addData(
            "SelectedInspection",
            Object.fromEntries(formData2)
          );
          router.push({
            name: "detailInspeksi",
            query: { detailInspeksi: selectedInspection.value.Name },
          });
          setTimeout(() => {
            selectedInspection.value = null;
            inspectionLocation.value = null;
            isSave.value = true;
          }, 1000);
        } else {
          alertV("Perhatian!", "Mohon isi lokasi inspeksi terlebih dahulu");
        }
      } else {
        alertV("Perhatian!", "Mohon pilih jenis inspeksi terlebih dahulu");
      }
    }

    return {
      employee,
      selectedInspection,
      submitJenis,
      inspectionDate,
      inspectionList,
      loading,
      inspectionLocation,
      doRefresh,
      chevronDownCircleOutline,
      connection,
      isSave,
      v$,
    };
  },
});
</script>

<style>
ion-content.pilih-inspeksi {
  --background: #f9f9ff;
}
.pilih-inspeksi ion-card-title {
  font-size: 28px;
  font-weight: 600;
}
.pilih-inspeksi ion-list,
.pilih-inspeksi ion-input {
  padding: 0 !important;
}
.pilih-inspeksi ion-list ion-item ion-label {
  font-weight: 600;
  font-size: 1.3rem !important;
}
.pilih-inspeksi ion-input {
  font-size: 1.2rem;
}
.pilih-inspeksi ion-note {
  font-size: 1rem;
  color: red;
}
.select-option {
  max-width: 94% !important;
  --placeholder-color: black;
  --placeholder-opacity: 1;
}
.select-option::part(placeholder),
.select-option::part(text) {
  color: black;
  font-size: 1.2rem;
}
.select-option::part(icon) {
  color: black;
  opacity: 1;
}
</style>
