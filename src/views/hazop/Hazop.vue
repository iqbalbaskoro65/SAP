<template>
  <ion-page>
    <ion-header mode="ios">
      <ion-toolbar>
        <ion-back-button default-href="/" slot="start" />
        <ion-title>Hazop Report</ion-title>
      </ion-toolbar>
      <offline-mode></offline-mode>
    </ion-header>
    <ion-content class="hazop" style="--padding-start: 5px; --padding-end: 5px">
      <!-- online mode -->
      <div v-if="connection == 'online'">
        <ion-card style="margin-top: 20px">
          <ion-list lines="none">
            <ion-item>
              <ion-label class="label"
                >Dilaporkan Tanggal <span>*</span></ion-label
              >
            </ion-item>
            <ion-item>
              <ion-input type="date" v-model="input.ReportDate" readonly />
            </ion-item>
          </ion-list>
        </ion-card>
        <ion-card>
          <ion-list lines="none">
            <ion-item>
              <ion-label> Nama Pelapor <span>*</span> </ion-label>
            </ion-item>
            <ion-item>
              <ion-input v-model="input.ReporterName" readonly></ion-input>
            </ion-item>
          </ion-list>
        </ion-card>
        <ion-card>
          <ion-list lines="none">
            <ion-item>
              <ion-label>Jabatan <span>*</span></ion-label>
            </ion-item>
            <ion-item>
              <ion-input v-model="input.Position" readonly></ion-input>
            </ion-item>
          </ion-list>
        </ion-card>
        <ion-card>
          <ion-list lines="none">
            <ion-item>
              <ion-label> NIK Karyawan <span>*</span> </ion-label>
            </ion-item>
            <ion-item>
              <ion-input v-model="input.Code" readonly></ion-input>
            </ion-item>
          </ion-list>
        </ion-card>
        <ion-card>
          <ion-list lines="none">
            <ion-item>
              <ion-label>Departemen <span>*</span></ion-label>
            </ion-item>
            <ion-item>
              <ion-input v-model="input.DeptName" readonly></ion-input>
            </ion-item>
          </ion-list>
        </ion-card>
        <ion-card>
          <ion-list lines="none">
            <ion-item>
              <ion-label>Lokasi</ion-label>
            </ion-item>
            <ion-item>
              <ion-input
                v-model="input.Location"
                placeholder="Masukkan jawaban"
              />
              <ion-note slot="end" v-if="v$.Location.$error && !isSave">
                {{ v$.Location.$errors[0].$message }}
              </ion-note>
            </ion-item>
          </ion-list>
        </ion-card>
        <ion-card>
          <ion-list lines="none">
            <ion-item>
              <ion-label>Bahaya yang dilaporkan</ion-label>
            </ion-item>
            <ion-item>
              <ion-textarea
                style="font-size: 1.3rem"
                v-model="input.ReportHazard"
                placeholder="Masukkan jawaban"
                :auto-grow="true"
              />
              <ion-note slot="end" v-if="v$.ReportHazard.$error && !isSave">
                {{ v$.ReportHazard.$errors[0].$message }}
              </ion-note>
            </ion-item>
          </ion-list>
        </ion-card>
        <ion-card>
          <ion-list lines="none">
            <ion-item>
              <ion-label class="ion-text-wrap">
                Tindakan Perbaikan Sementara yang Telah Dilakukan
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-textarea
                style="font-size: 1.3rem"
                v-model="input.TemporaryAction"
                placeholder="Masukkan jawaban"
                :auto-grow="true"
              />
              <ion-note slot="end" v-if="v$.TemporaryAction.$error && !isSave">
                {{ v$.TemporaryAction.$errors[0].$message }}
              </ion-note>
            </ion-item>
          </ion-list>
        </ion-card>
        <ion-card>
          <ion-list lines="none">
            <ion-item>
              <ion-label class="ion-text-wrap">
                Tindakan perbaikan Selanjutnya Apabila Diperlukan
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-textarea
                style="font-size: 1.3rem"
                v-model="input.Action"
                placeholder="Masukkan jawaban"
                :auto-grow="true"
              />
              <ion-note slot="end" v-if="v$.Action.$error && !isSave">
                {{ v$.Action.$errors[0].$message }}
              </ion-note>
            </ion-item>
          </ion-list>
        </ion-card>
        <ion-card>
          <ion-list lines="none">
            <ion-item>
              <ion-label>Telah diperbaiki :</ion-label>
              <ion-checkbox
                v-model="input.IsRepaired"
                slot="end"
              ></ion-checkbox>
            </ion-item>
          </ion-list>
        </ion-card>
        <ion-card>
          <ion-list lines="none">
            <ion-item>
              <ion-label>
                Upload Foto (apabila ada) <br />
                <span style="font-size: 16px">Max 4Mb (img/*)</span>
              </ion-label>
            </ion-item>
            <ion-item>
              <input
                ref="fileF"
                type="file"
                accept="image/*"
                multiple
                @change.prevent="handleFileUpload($event)"
              />
            </ion-item>
          </ion-list>
        </ion-card>
        <div
          style="display: flex; justify-content: center; margin-bottom: 10px"
        >
          <ion-button @click="submitButton()" color="primary">
            Submit
          </ion-button>
        </div>
      </div>
      <!-- offline mode -->
      <div v-if="connection == 'offline'">
        <ion-card style="margin-top: 20px">
          <ion-list lines="none">
            <ion-item>
              <ion-label>Dilaporkan Tanggal <span>*</span></ion-label>
            </ion-item>
            <ion-item>
              <ion-input type="date" v-model="input.ReportDate" readonly />
            </ion-item>
          </ion-list>
        </ion-card>
        <ion-card>
          <ion-list lines="none">
            <ion-item>
              <ion-label> Nama Pelapor <span>*</span> </ion-label>
            </ion-item>
            <ion-item>
              <ion-input
                v-model="input.ReporterName"
                placeholder="Masukkan jawaban"
              />
              <ion-note slot="end" v-if="v$.ReporterName.$error && !isSave">
                {{ v$.ReporterName.$errors[0].$message }}
              </ion-note>
            </ion-item>
          </ion-list>
        </ion-card>
        <ion-card>
          <ion-list lines="none">
            <ion-item>
              <ion-label>Jabatan <span>*</span></ion-label>
            </ion-item>
            <ion-item>
              <ion-input
                v-model="input.Position"
                placeholder="Masukkan jawaban"
              />
              <ion-note slot="end" v-if="v$.Position.$error && !isSave">
                {{ v$.Position.$errors[0].$message }}
              </ion-note>
            </ion-item>
          </ion-list>
        </ion-card>
        <ion-card>
          <ion-list lines="none">
            <ion-item>
              <ion-label> NIK Karyawan <span>*</span> </ion-label>
            </ion-item>
            <ion-item>
              <ion-input
                type="number"
                v-model="input.Code"
                placeholder="Masukkan jawaban"
              />
              <ion-note slot="end" v-if="v$.Code.$error && !isSave">
                {{ v$.Code.$errors[0].$message }}
              </ion-note>
            </ion-item>
          </ion-list>
        </ion-card>
        <ion-card>
          <ion-list lines="none">
            <ion-item>
              <ion-label>Departemen <span>*</span></ion-label>
            </ion-item>
            <ion-item>
              <ion-input
                v-model="input.DeptName"
                placeholder="Masukkan jawaban"
              />
              <ion-note slot="end" v-if="v$.DeptName.$error && !isSave">
                {{ v$.DeptName.$errors[0].$message }}
              </ion-note>
            </ion-item>
          </ion-list>
        </ion-card>
        <ion-card>
          <ion-list lines="none">
            <ion-item>
              <ion-label>Lokasi</ion-label>
            </ion-item>
            <ion-item>
              <ion-input
                v-model="input.Location"
                placeholder="Masukkan jawaban"
              />
              <ion-note slot="end" v-if="v$.Location.$error && !isSave">
                {{ v$.Location.$errors[0].$message }}
              </ion-note>
            </ion-item>
          </ion-list>
        </ion-card>
        <ion-card>
          <ion-list lines="none">
            <ion-item>
              <ion-label>Bahaya yang dilaporkan</ion-label>
            </ion-item>
            <ion-item>
              <ion-textarea
                v-model="input.ReportHazard"
                placeholder="Masukkan jawaban"
                :auto-grow="true"
              >
              </ion-textarea>
              <ion-note slot="end" v-if="v$.ReportHazard.$error && !isSave">
                {{ v$.ReportHazard.$errors[0].$message }}
              </ion-note>
            </ion-item>
          </ion-list>
        </ion-card>
        <ion-card>
          <ion-list lines="none">
            <ion-item>
              <ion-label class="ion-text-wrap">
                Tindakan Perbaikan Sementara yang Telah Dilakukan
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-textarea
                v-model="input.TemporaryAction"
                placeholder="Masukkan jawaban"
                :auto-grow="true"
              >
              </ion-textarea>
              <ion-note slot="end" v-if="v$.TemporaryAction.$error && !isSave">
                {{ v$.TemporaryAction.$errors[0].$message }}
              </ion-note>
            </ion-item>
          </ion-list>
        </ion-card>
        <ion-card>
          <ion-list lines="none">
            <ion-item>
              <ion-label class="ion-text-wrap">
                Tindakan perbaikan Selanjutnya Apabila Diperlukan
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-textarea
                v-model="input.Action"
                placeholder="Masukkan jawaban"
                :auto-grow="true"
              >
              </ion-textarea>
              <ion-note slot="end" v-if="v$.Action.$error && !isSave">
                {{ v$.Action.$errors[0].$message }}
              </ion-note>
            </ion-item>
          </ion-list>
        </ion-card>
        <ion-card>
          <ion-list lines="none">
            <ion-item>
              <ion-label>Telah diperbaiki :</ion-label>
              <ion-checkbox v-model="input.IsRepaired" slot="end" />
            </ion-item>
          </ion-list>
        </ion-card>
        <div
          style="display: flex; justify-content: center; margin-bottom: 10px"
        >
          <ion-button @click="saveButton()" color="success">Save</ion-button>
        </div>
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
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import dataServices from "../../services/storage";
import { alertV, tokenExpired, toastV } from "../../composables/alerts";
import { getDateNow } from "../../composables/composables";
import { addOutline } from "ionicons/icons";
import axios from "axios";
//validation
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import OfflineMode from "../../components/OfflineMode.vue";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonInput,
  IonCheckbox,
  IonButton,
  IonNote,
  IonLoading,
  alertController,
  IonTextarea,
} from "@ionic/vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "hazopView",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonBackButton,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonCard,
    IonInput,
    IonCheckbox,
    IonButton,
    IonNote,
    IonLoading,
    IonTextarea,
    OfflineMode,
  },
  setup() {
    const fileF = ref();
    const employee = ref([]);
    const isSave = ref();
    const input = reactive({
      ReporterName: null,
      ReportDate: null,
      Position: null,
      Code: null,
      DeptName: null,
      Location: null,
      ReportHazard: null,
      TemporaryAction: null,
      Action: null,
      Files: null,
      IsRepaired: 0,
    });
    const connection = ref();
    const loading = ref(true);

    const router = useRouter();

    const rules = computed(() => {
      return {
        ReporterName: { required },
        Position: { required },
        Code: { required },
        DeptName: { required },
        ReportDate: { required },
        Location: { required },
        ReportHazard: { required },
        TemporaryAction: { required },
        Action: { required },
      };
    });
    const v$ = useVuelidate(rules, input);

    onMounted(() => {
      input.ReportDate = getDateNow();
      const mode = ls.get("mode", { decrypt: true });
      const token = ls.get("token", { decrypt: true });
      connection.value = mode;
      if (mode === "online") {
        loadEmployee(token);
      } else {
        loading.value = false;
      }
    });

    function handleFileUpload(e) {
      console.log(e.target.files);
      input.Files = e.target.files;
    }

    async function loadEmployee(token) {
      try {
        const result = await axios.get(`/Api/General/GetUserInformation`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (result.status == 200) {
          console.log(result.data);
          loading.value = false;
          employee.value = result.data[0];
          input.ReporterName = result.data[0].Name;
          input.Position = result.data[0].Position;
          input.Code = result.data[0].Code;
          input.DeptName = result.data[0].Department;
        } else {
          loading.value = false;
          tokenExpired("Session has expired...");
        }
      } catch (error) {
        loading.value = false;
        tokenExpired(error.code);
      }
    }

    async function saveButton() {
      isSave.value = false;
      this.v$.$validate();
      if (!this.v$.$error) {
        const data = new FormData();
        data.append("Id", new Date().getTime());
        data.append("EmployeeCode", input.Code);
        data.append("ReportDate", input.ReportDate);
        data.append("Position", input.Position);
        data.append("ReportHazard", input.ReportHazard);
        data.append("TemporaryAction", input.TemporaryAction);
        data.append("Action", input.Action);
        data.append("IsRepaired", input.IsRepaired == true ? 1 : 0);
        data.append("Location", input.Location);
        data.append("Pelapor", input.ReporterName);
        data.append("Department", input.DeptName);
        let sendData = Object.fromEntries(data);
        console.log(sendData);
        await dataServices.addData("Hazop", sendData);
        toastV("Hazop Report berhasil di simpan", "success");
        isSave.value = true;
        input.ReporterName = null;
        input.Position = null;
        input.Code = null;
        input.DeptName = null;
        input.ReportHazard = null;
        input.Location = null;
        input.TemporaryAction = null;
        input.Action = null;
        input.IsRepaired = false;
        input.Files = null;

        router.push({ name: "home" });
      } else {
        toastV("Gagal save, silahkan lengkapi data terlebih dahulu", "danger");
      }
    }

    // async function GetToken() {
    //   const params = new FormData();
    //   params.append("user", "aldo.ep");
    //   params.append("password", "aldo19");
    //   try {
    //     const res = await axios.post("https://192.168.1.19/Auth/Token", params);
    //     return res.data;
    //   } catch (error) {
    //     console.log(error.code);
    //   }
    // }

    async function submitButton() {
      const token = ls.get("token", { decrypt: true });
      // const token = await GetToken();
      console.log(token);
      isSave.value = false;
      this.v$.$validate();
      if (!this.v$.$error) {
        console.log(input.Files);
        if (input.Files) {
          loading.value = true;
          const formData = new FormData();
          formData.append("ReporterName", input.ReporterName);
          formData.append("EmployeeCode", input.Code);
          formData.append("Department", input.DeptName);
          formData.append("ReportDate", input.ReportDate);
          formData.append("Position", input.Position);
          formData.append("ReportHazard", input.ReportHazard);
          formData.append("Location", input.Location);
          formData.append("TemporaryAction", input.TemporaryAction);
          formData.append("Action", input.Action);
          formData.append("IsRepaired", input.IsRepaired == true ? 1 : 0);
          for (const i of Object.keys(input.Files)) {
            formData.append("Files", input.Files[i]);
          }
          console.log(formData);
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
            console.log(response.data);
            if (response.data == "Success") {
              toastV("Hazop Report berhasil di upload ke server", "success");
              loading.value = false;

              isSave.value = true;
              input.ReportHazard = null;
              input.Location = null;
              input.TemporaryAction = null;
              input.Action = null;
              input.IsRepaired = false;
              input.Files = null;

              fileF.value.value = null;

              router.push({ name: "home" });
            } else {
              loading.value = false;
              if (
                response.data
                  .toString()
                  .includes("Maximum request length exceeded")
              ) {
                toastV(
                  "Hazop Report gagal di upload ke server, Ukuran foto melebihi 4Mb",
                  "danger"
                );
              } else {
                toastV(
                  "Hazop Report gagal di upload ke server, Tndakan perbaikan sementara/Tindakan perbaikan selanjutnya melebihi 500 kata",
                  "danger"
                );
              }
            }
          } catch (error) {
            loading.value = false;
            alertV("Error", error);
          }
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
                  loading.value = true;
                  const formData = new FormData();
                  formData.append("ReporterName", input.ReporterName);
                  formData.append("EmployeeCode", input.Code);
                  formData.append("ReportDate", input.ReportDate);
                  formData.append("Department", input.DeptName);
                  formData.append("Position", input.Position);
                  formData.append("ReportHazard", input.ReportHazard);
                  formData.append("Location", input.Location);
                  formData.append("TemporaryAction", input.TemporaryAction);
                  formData.append("Action", input.Action);
                  formData.append(
                    "IsRepaired",
                    input.IsRepaired == true ? 1 : 0
                  );
                  formData.append("Files", input.Files);
                  console.log(formData);
                  try {
                    const response = await axios.post(
                      `/Api/SAP/ReceiveDataHazardReport/`,
                      formData,
                      {
                        headers: {
                          "Access-Control-Allow-Origin": "*",
                          "Access-Control-Allow-Methods":
                            "DELETE, POST, GET, OPTIONS",
                          "Access-Control-Allow-Headers":
                            "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
                          "Content-Type": "multipart/form-data",
                          Authorization: "Bearer " + token,
                        },
                      }
                    );
                    console.log(response.data);
                    if (response.data == "Success") {
                      toastV(
                        "Hazop Report berhasil di upload ke server",
                        "success"
                      );
                      loading.value = false;

                      isSave.value = true;
                      input.ReportHazard = null;
                      input.Location = null;
                      input.TemporaryAction = null;
                      input.Action = null;
                      input.IsRepaired = false;
                      input.Files = null;

                      fileF.value.value = null;

                      router.push({ name: "home" });
                    } else {
                      loading.value = false;
                      if (
                        response.data
                          .toString()
                          .includes("Maximum request length exceeded")
                      ) {
                        toastV(
                          "Hazop Report gagal di upload ke server, Ukuran foto melebihi 4Mb",
                          "danger"
                        );
                      } else {
                        toastV(
                          "Hazop Report gagal di upload ke server, Tndakan perbaikan sementara/Tindakan perbaikan selanjutnya melebihi 500 kata",
                          "danger"
                        );
                      }
                    }
                  } catch (error) {
                    loading.value = false;
                    alertV("Error", error);
                  }
                },
              },
            ],
          });
          alert.present();
        }
      } else {
        toastV(
          "Gagal submit data, silahkan lengkapi data terlebih dahulu",
          "danger"
        );
      }
    }

    return {
      fileF,
      isSave,
      connection,
      v$,
      input,
      saveButton,
      submitButton,
      addOutline,
      employee,
      handleFileUpload,
      loading,
    };
  },
});
</script>

<style>
ion-content.hazop {
  --background: #f9f9ff;
}
.hazop ion-list {
  background: transparent;
  padding: 8px;
}
.hazop ion-list span {
  color: red;
  font-weight: 600;
}
.hazop ion-label {
  font-size: 1.3rem !important;
  font-weight: 600;
}
.hazop ion-input,
.hazop ion-textarea {
  font-size: 1.2rem;
}
.hazop ion-note {
  font-size: 1rem;
  color: red;
}
</style>
