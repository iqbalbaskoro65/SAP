<template>
  <ion-page>
    <ion-header mode="ios">
      <ion-toolbar>
        <ion-back-button default-href="/" slot="start" />
        <ion-title>Detail Inspeksi</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="inspeksi">
      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content refreshing-text="Refreshing...">
        </ion-refresher-content>
      </ion-refresher>
      <h2
        style="
          width: fit-content;
          margin: 0 auto;
          margin-top: 20px;
          text-align: center;
          font-weight: 600;
          border-bottom: 2px solid silver;
        "
      >
        {{ title }}
      </h2>
      <ion-list style="background: transparent; padding: 8px">
        <ion-card style="margin-top: 20px" class="inspektor">
          <ion-list lines="none">
            <ion-item>
              <ion-label>Tanggal Inspeksi</ion-label>
            </ion-item>
            <ion-item>
              <ion-input
                type="date"
                v-model="inspectorData.InspectionDate"
                readonly
              />
            </ion-item>
            <ion-item>
              <ion-label>Inspektor</ion-label>
            </ion-item>
            <ion-item>
              <ion-input
                type="text"
                v-model="inspectorData.Inspector"
                readonly
              />
            </ion-item>
            <ion-item>
              <ion-label>NIK Inspektor</ion-label>
            </ion-item>
            <ion-item>
              <ion-input
                type="number"
                v-model="inspectorData.InspectorCode"
                readonly
              />
            </ion-item>
          </ion-list>
        </ion-card>
        <ion-card v-if="noQuestion">
          <ion-item lines="none">
            <ion-label class="ion-text-center" style="color: red">
              Data Inspeksi Kosong
            </ion-label>
          </ion-item>
        </ion-card>
        <div v-if="!noQuestion">
          <ion-card>
            <ion-list lines="none">
              <ion-item>
                <ion-label>
                  Rincian Bahaya <span style="color: red">*</span>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-textarea
                  style="font-size: 1.2rem"
                  v-model="reportHazard"
                  placeholder="Masukkan jawaban"
                  :auto-grow="true"
                >
                </ion-textarea>
                <ion-note
                  style="padding-top: 10px"
                  slot="end"
                  v-if="v$.reportHazard.$error && !isSave"
                >
                  {{ v$.reportHazard.$errors[0].$message }}
                </ion-note>
              </ion-item>
            </ion-list>
          </ion-card>
          <ion-card>
            <ion-list lines="none">
              <ion-item>
                <ion-label text-wrap>
                  Tindakan Perbaikan Sementara yang Telah Dilakukan
                  <span style="color: red">*</span></ion-label
                >
              </ion-item>
              <ion-item>
                <ion-textarea
                  style="font-size: 1.2rem"
                  v-model="temporaryAction"
                  placeholder="Masukkan jawaban"
                  :auto-grow="true"
                >
                </ion-textarea>
                <ion-note
                  style="padding-top: 10px"
                  slot="end"
                  v-if="v$.temporaryAction.$error && !isSave"
                >
                  {{ v$.temporaryAction.$errors[0].$message }}
                </ion-note>
              </ion-item>
            </ion-list>
          </ion-card>
          <ion-card>
            <ion-list lines="none">
              <ion-item>
                <ion-label text-wrap>
                  Tindakan perbaikan Selanjutnya Apabila Diperlukan
                  <span style="color: red">*</span></ion-label
                >
              </ion-item>
              <ion-item>
                <ion-textarea
                  style="font-size: 1.2rem"
                  v-model="Action"
                  placeholder="Masukkan jawaban"
                  :auto-grow="true"
                >
                </ion-textarea>
                <ion-note
                  style="padding-top: 10px"
                  slot="end"
                  v-if="v$.Action.$error && !isSave"
                >
                  {{ v$.Action.$errors[0].$message }}
                </ion-note>
              </ion-item>
            </ion-list>
          </ion-card>
          <ion-card v-for="question in questions" :key="question.QuestionOid">
            <ion-list lines="none">
              <ion-item>
                <ion-label text-wrap
                  >{{ question.QuestionText }}
                  <span style="color: red">*</span></ion-label
                >
              </ion-item>
              <div class="jawaban">
                <ion-item v-if="question.OptionType == 0">
                  <ion-input
                    type="text"
                    placeholder="Masukkan jawaban"
                    v-model="question.Selected"
                  />
                </ion-item>
                <ion-radio-group
                  v-if="question.OptionType == 1"
                  v-model="question.Selected"
                >
                  <ion-item
                    v-for="pilihan in question.QuestionOption"
                    :key="pilihan.OptionOid"
                  >
                    <ion-label>{{ pilihan.OptionText }}</ion-label>
                    <ion-radio
                      slot="end"
                      :value="pilihan.OptionOid"
                    ></ion-radio>
                  </ion-item>
                </ion-radio-group>
                <ion-item v-if="!question.Selected && !isSave && isErr">
                  <ion-note style="padding-top: 10px" slot="end">
                    Value is required
                  </ion-note>
                </ion-item>
                <ion-item
                  v-if="question.OptionType == 1"
                  style="margin-top: 10px"
                >
                  <ion-input
                    type="text"
                    placeholder="Masukkan Komentar"
                    v-model="question.Note"
                  />
                </ion-item>
              </div>
            </ion-list>
          </ion-card>
          <ion-card>
            <ion-list lines="none">
              <ion-item>
                <ion-label>
                  Upload Foto (apabila ada) <br />
                  <span style="font-size: 16px; color: red">
                    Max 4Mb (img/*)
                  </span>
                </ion-label>
              </ion-item>
              <ion-item lines="none">
                <input
                  ref="fileF"
                  type="file"
                  accept="image/*"
                  multiple
                  @change="handleFileUpload($event)"
                />
              </ion-item>
            </ion-list>
          </ion-card>
        </div>
        <div
          style="display: flex; justify-content: center; margin-bottom: 10px"
        >
          <ion-button
            :disabled="noQuestion"
            @click="submitButton()"
            style="font-weight: 600"
          >
            Submit
          </ion-button>
        </div>
      </ion-list>
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
import { computed, defineComponent, onMounted, onUpdated, ref } from "vue";
import dataServices from "../../services/storage";
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
  IonRadioGroup,
  IonRadio,
  IonButton,
  IonLoading,
  alertController,
  IonTextarea,
  IonRefresher,
  IonRefresherContent,
  IonNote,
} from "@ionic/vue";
import { addOutline } from "ionicons/icons";
import { useRoute, useRouter } from "vue-router";
import { alertV, toastV, tokenExpired } from "../../composables/alerts";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import ls from "localstorage-slim";
// validasi
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default defineComponent({
  name: "InspeksiView",
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
    IonRadioGroup,
    IonRadio,
    IonButton,
    IonLoading,
    IonTextarea,
    IonRefresher,
    IonRefresherContent,
    IonNote,
  },
  setup() {
    const fileF = ref();
    const listData = ref([]);
    const isSave = ref();
    const route = useRoute();
    const title = ref();
    const inspectorData = ref([]);
    const SelectedInspection = ref([]);
    const questions = ref([]);
    const loading = ref(true);
    const noQuestion = ref();
    const fileInspection = ref([]);
    const reportHazard = ref();
    const temporaryAction = ref();
    const Action = ref();
    const isErr = ref();

    const router = useRouter();

    const rules = computed(() => ({
      reportHazard: { required },
      temporaryAction: { required },
      Action: { required },
    }));
    const v$ = useVuelidate(rules, {
      reportHazard,
      temporaryAction,
      Action,
    });

    const doRefresh = (event) => {
      setTimeout(() => {
        const token = ls.get("token", { decrypt: true });
        const mode = ls.get("mode", { decrypt: true });
        title.value = route.query.detailInspeksi;
        if (mode == "online") {
          loadData(token);
        }
        setTimeout(() => {
          event.target.complete();
        }, 500);
      }, 1500);
    };

    onMounted(async () => {
      const token = ls.get("token", { decrypt: true });
      const mode = ls.get("mode", { decrypt: true });
      title.value = route.query.detailInspeksi;
      if (mode == "online") {
        loadData(token);
      }
    });
    onUpdated(async () => {
      const token = ls.get("token", { decrypt: true });
      const mode = ls.get("mode", { decrypt: true });
      title.value = route.query.detailInspeksi;
      if (mode == "online") {
        loadData(token);
      }
    });

    function toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = (error) => reject(error);
      });
    }

    async function handleFileUpload(files) {
      for (let index = 0; index < files.target.files.length; index++) {
        let images = {
          Image: await toBase64(files.target.files[index]),
        };
        fileInspection.value.push(images);
      }
    }

    async function loadData(token) {
      const inspector = await dataServices.getData("InspectorData");
      const inspectionCategory = await dataServices.getData(
        "SelectedInspection"
      );
      if (inspector && inspectionCategory) {
        if (inspector.length > 0 && inspectionCategory.length > 0) {
          inspectorData.value = inspector[0];
          SelectedInspection.value = inspectionCategory[0];
          getQuestions(token);
        } else {
          loading.value = false;
          alertV(
            "Perhatian",
            "Jenis Inspeksi tidak ditemukan,mohon coba pilih Jenis Inspeksi kembali"
          );
        }
      }
    }

    async function getQuestions(token) {
      dataServices.clearData(SelectedInspection.value.Oid);
      try {
        const params = {
          InspeksiOid: SelectedInspection.value.Oid,
        };
        const res = await axios.post(
          "/Api/SAP/GetQuestionsOfInspection",
          params,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (res.status == 200) {
          if (res.data.length > 0) {
            loading.value = false;
            const maping = res.data.map((obj) => ({
              ...obj,
              Selected: null,
              Note: null,
            }));
            questions.value = maping;
            console.log(maping);
            noQuestion.value = false;
            dataServices.addData(SelectedInspection.value.Oid, maping);
          } else {
            loading.value = false;
            noQuestion.value = true;
          }
        } else {
          loading.value = false;
          tokenExpired("Session has expired...");
        }
      } catch (error) {
        loading.value = false;
        tokenExpired(error.code);
      }
    }

    // async function getToken() {
    //   const users = new FormData();
    //   users.append("user", "aldo.ep");
    //   users.append("password", "aldo19");
    //   try {
    //     const res = await axios.post("https://192.168.1.16/Auth/Token", users);
    //     console.log(res);
    //     if (res.status == 200) {
    //       return res.data;
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }

    async function submitButton() {
      isSave.value = false;
      loading.value = true;
      const token = ls.get("token", { decrypt: true });
      let isAnswer = [];
      questions.value.forEach((val) => {
        if (val.Selected != null) {
          isAnswer.push({
            isAnswer: true,
          });
        } else {
          isAnswer.push({
            isAnswer: false,
          });
        }
      });
      const isValid = isAnswer.every((item) => item.isAnswer === true);
      console.log(isValid);
      this.v$.$validate();
      if (!this.v$.$error) {
        if (isValid) {
          if (fileInspection.value.length > 0) {
            console.log(fileInspection.value);
            try {
              const sendData = [
                {
                  Oid: uuidv4(),
                  InspectionDate: inspectorData.value.InspectionDate,
                  InspectionCatOid: SelectedInspection.value.Oid,
                  InspectorName: inspectorData.value.Inspector,
                  InspectorCode: inspectorData.value.InspectorCode,
                  Department: inspectorData.value.Department,
                  Position: inspectorData.value.InspectorPosition,
                  Location: inspectorData.value.Location,
                  ReportHazard: reportHazard.value,
                  TemporaryAction: temporaryAction.value,
                  Action: Action.value,
                  InspectionAnswer: [],
                  InspectionImage: fileInspection.value,
                },
              ];
              questions.value.forEach((val) => {
                if (val.OptionType == 0) {
                  let test = {
                    QuestionOid: val.QuestionOid,
                    AnswerEssay: val.Selected,
                    AnswerMultiple: "",
                    Note: "",
                  };
                  sendData[0].InspectionAnswer.push(test);
                } else {
                  let test = {
                    QuestionOid: val.QuestionOid,
                    AnswerMultiple: val.Selected,
                    AnswerEssay: "",
                    Note: val.Note,
                  };
                  sendData[0].InspectionAnswer.push(test);
                }
              });
              console.log(sendData);
              const res = await axios.post(
                "/Api/SAP/ReceiveDataInspection",
                sendData,
                {
                  headers: {
                    Authorization: "Bearer " + token,
                  },
                }
              );
              console.log(res.data);
              if (res.status == 200) {
                if (res.data == "Success") {
                  loading.value = false;
                  toastV("Inspeksi berhasil di upload ke server", "success");
                  questions.value.forEach((val) => {
                    val.Selected = null;
                    val.Note = null;
                  });
                  isSave.value = true;
                  reportHazard.value = null;
                  temporaryAction.value = null;
                  Action.value = null;
                  fileInspection.value = [];

                  fileF.value.value = null;
                  router.push({ name: "home" });
                } else {
                  loading.value = false;
                  fileInspection.value = [];
                  if (
                    res.data
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
              } else {
                fileInspection.value = [];
                loading.value = false;
                alertV("ERROR", "Inspeksi gagal di upload ke server");
              }
            } catch (error) {
              fileInspection.value = [];
              loading.value = false;
              alertV("ERROR", error.code);
            }
          } else {
            loading.value = false;
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
                    try {
                      loading.value = true;
                      const sendData = [
                        {
                          Oid: uuidv4(),
                          InspectionDate: inspectorData.value.InspectionDate,
                          InspectionCatOid: SelectedInspection.value.Oid,
                          InspectorName: inspectorData.value.Inspector,
                          InspectorCode: inspectorData.value.InspectorCode,
                          Department: inspectorData.value.Department,
                          Position: inspectorData.value.InspectorPosition,
                          Location: inspectorData.value.Location,
                          ReportHazard: reportHazard.value,
                          TemporaryAction: temporaryAction.value,
                          Action: Action.value,
                          InspectionAnswer: [],
                          InspectionImage: [],
                        },
                      ];
                      questions.value.forEach((val) => {
                        if (val.OptionType == 0) {
                          let test = {
                            QuestionOid: val.QuestionOid,
                            AnswerEssay: val.Selected,
                            AnswerMultiple: "",
                            Note: "",
                          };
                          sendData[0].InspectionAnswer.push(test);
                        } else {
                          let test = {
                            QuestionOid: val.QuestionOid,
                            AnswerMultiple: val.Selected,
                            AnswerEssay: "",
                            Note: val.Note,
                          };
                          sendData[0].InspectionAnswer.push(test);
                        }
                      });
                      console.log(sendData);
                      const res = await axios.post(
                        "/Api/SAP/ReceiveDataInspection",
                        sendData,
                        {
                          headers: {
                            Authorization: "Bearer " + token,
                          },
                        }
                      );
                      console.log(res.data);
                      if (res.status == 200) {
                        if (res.data == "Success") {
                          loading.value = false;
                          toastV(
                            "Inspeksi berhasil di upload ke server",
                            "success"
                          );
                          questions.value.forEach((val) => {
                            val.Selected = null;
                            val.Note = null;
                          });
                          isSave.value = true;
                          reportHazard.value = null;
                          temporaryAction.value = null;
                          Action.value = null;
                          fileInspection.value = [];

                          fileF.value.value = null;

                          router.push({ name: "home" });
                        } else {
                          fileInspection.value = [];
                          loading.value = false;
                          if (
                            res.data
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
                      } else {
                        fileInspection.value = [];
                        loading.value = false;
                        alertV("ERROR", "Inspeksi gagal di upload ke server");
                      }
                    } catch (error) {
                      fileInspection.value = [];
                      loading.value = false;
                      alertV("ERROR", error.code);
                    }
                  },
                },
              ],
            });
            alert.present();
          }
        } else {
          loading.value = false;
          isErr.value = true;
          alertV(
            "Gagal submit inspeksi",
            "Silahkan isi semua data terlebih dahulu!"
          );
        }
      } else {
        isErr.value = true;
        loading.value = false;
        alertV(
          "Gagal submit inspeksi",
          "Silahkan isi semua data terlebih dahulu!"
        );
      }
    }

    return {
      isErr,
      fileF,
      title,
      listData,
      addOutline,
      inspectorData,
      SelectedInspection,
      questions,
      submitButton,
      loading,
      noQuestion,
      fileInspection,
      handleFileUpload,
      reportHazard,
      temporaryAction,
      Action,
      isSave,
      doRefresh,
      v$,
    };
  },
});
</script>

<style>
ion-content.inspeksi {
  --background: #f9f9ff;
}
.inspeksi ion-card {
  padding: 10px 5px;
}
.inspeksi ion-label {
  font-size: 1.3rem !important;
  font-weight: 600;
}
.inspeksi ion-input {
  font-size: 1.2rem !important;
}
.inspeksi .jawaban ion-label {
  padding-left: 20px;
  font-size: 1.1rem !important;
  font-weight: 300;
}
.inspektor ion-label {
  margin: 0;
}
.inspektor ion-item {
  padding: 0;
  margin: 0;
}
.inspeksi ion-list {
  padding: 0;
  /* margin-top: -20px; */
}
.inspeksi ion-note {
  font-size: 1rem;
  color: red;
}
.inspektor input.native-input.sc-ion-input-ios,
.inspektor input.native-input.sc-ion-input-md {
  padding: 0 !important;
}
</style>
