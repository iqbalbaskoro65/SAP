<template>
  <ion-page>
    <ion-content class="login">
      <div style="margin-top: 30px" id="header">
        <h1>{{ title }}</h1>
        <img src="../assets/img/logo.png" alt="" />
      </div>
      <div class="input-group" style="margin-top: 50px">
        <div class="input ion-activatable ripple-parent">
          <ion-input
            style="text-align: center"
            type="text"
            placeholder="Username"
            v-model="user.username"
          />
          <ion-ripple-effect></ion-ripple-effect>
          <ion-icon :icon="eyeOutline" class="hidden" />
        </div>
        <div class="input ion-activatable ripple-parent">
          <ion-input
            class="password"
            style="text-align: center"
            @keyup.enter="Login"
            :type="typePass"
            placeholder="Password"
            v-model="user.password"
          />
          <ion-ripple-effect></ion-ripple-effect>
          <ion-icon
            v-if="typePass == 'password'"
            :icon="eyeOutline"
            @click.prevent="showPass('text')"
          />
          <ion-icon
            v-else
            :icon="eyeOffOutline"
            @click.prevent="showPass('password')"
          />
        </div>
      </div>

      <!-- <ion-spinner v-if="loading" class="loading" name="crescent"></ion-spinner> -->
      <ion-text color="danger" v-if="errored == 'true'">
        <h5>{{ errMsg }}</h5>
      </ion-text>
      <ion-button
        mode="ios"
        class="login"
        @click.prevent="Login"
        expand="block"
      >
        <span style="font-size: 1.5rem"> Log in</span>
      </ion-button>
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
//store data
import ls from "localstorage-slim";
//composables
import { confirmExit, toastV } from "../composables/alerts";

import { useRouter } from "vue-router";
import { defineComponent, ref, reactive, onMounted } from "vue";
import { eyeOutline, eyeOffOutline } from "ionicons/icons";
import axios from "axios";
import {
  IonButton,
  IonContent,
  IonPage,
  // IonItem,
  IonInput,
  IonText,
  alertController,
  // IonSpinner,
  IonLoading,
  useBackButton,
  IonIcon,
  IonRippleEffect,
} from "@ionic/vue";
import { Network } from "@capacitor/network";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

export default defineComponent({
  components: {
    IonButton,
    IonContent,
    IonPage,
    // IonItem,
    IonInput,
    IonText,
    // IonSpinner,
    IonLoading,
    IonIcon,
    IonRippleEffect,
  },
  setup() {
    const location = ref("");
    const title = ref("SAP Mobile");
    const loading = ref(false);
    const errMsg = ref();
    const user = reactive({
      username: "",
      password: "",
    });
    const router = useRouter();
    const errored = ref("false");
    const typePass = ref("password");

    Date.prototype.addHours = function (h) {
      this.setTime(this.getTime() + h * 60 * 60 * 1000);
      return this;
    };
    useBackButton(-1, () => {
      if (router.currentRoute.value.name == "login") {
        confirmExit();
      }
    });

    onMounted(() => {
      const platform = Capacitor.getPlatform();
      if (platform == "ios") {
        title.value = "BBS Program";
      } else {
        title.value = "SAP Mobile";
      }
      connectionMode();
    });

    const Login = async () => {
      const users = new FormData();
      users.append("user", user.username);
      users.append("password", user.password);
      loading.value = true;
      setTimeout(async () => {
        if (user.username == null || user.username == "") {
          loading.value = false;
          errored.value = "true";
          errMsg.value = "Username tidak boleh kosong";
        } else {
          try {
            const response = await axios.post(`/Auth/Token`, users);
            if (response.status == 200) {
              if (response.data != "failed") {
                ls.set("loading-screen", true, { encrypt: true });
                ls.set("token", response.data, { encrypt: true });
                user.username = "";
                user.password = "";
                errored.value = "false";
                typePass.value = "password";
                loading.value = false;
                router.push({ name: "splash" });
              } else {
                loading.value = false;
                errored.value = "true";
                errMsg.value = "Invalid username / password";
              }
            }
          } catch (error) {
            loading.value = false;
            console.log(error);
            toastV(error, "danger");
          }
        }
      }, 500);
    };

    async function connectionMode() {
      const connection = await Network.getStatus();
      console.log(connection.connected);
      if (connection.connected) {
        toastV("Terhubung internet", "success");
        ls.set("mode", "online", { encrypt: true });
      } else {
        toastV("Tidak terhubung internet", "danger");
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "Perhatian!",
          subHeader:
            "Anda sekarang terdeteksi menggunakan mode Offline. lanjutkan mode Offline?",
          mode: "ios",
          backdropDismiss: false,
          buttons: [
            {
              text: "Batal",
              role: "cancel",
              cssClass: "secondary",
              id: "cancel-button",
              handler: async () => {
                const platform = Capacitor.getPlatform();
                console.log(platform);
                if (platform == "ios" || platform == "web") {
                  router.go();
                  // connectionMode();
                } else {
                  App.exitApp();
                }
              },
            },
            {
              text: "Lanjutkan",
              id: "confirm-button",
              handler: () => {
                ls.set("mode", "offline", { encrypt: true });
                ls.set("loading-screen", true, { encrypt: true });
                router.push({ name: "splash" });
              },
            },
          ],
        });
        return alert.present();
      }
    }
    const showPass = async (type) => {
      typePass.value = type;
    };

    return {
      user,
      errMsg,
      errored,
      Login,
      loading,
      eyeOutline,
      eyeOffOutline,
      location,
      router,
      typePass,
      showPass,
      title,
    };
  },
});
</script>

<style>
ion-content.login {
  position: relative;
  --background: #f5f5f3;
}
.login ion-input.password {
}
.ios .login ion-input {
  font-size: 1.3rem;
  padding-left: 55px !important;
}
.md .login ion-input {
  font-size: 1.3rem;
  padding-left: 40px !important;
}
#header {
  display: flex;
  flex-direction: column;
  align-items: center;
}
#header h1 {
  margin-top: 15%;
  margin-bottom: 15%;
  font-weight: 700;
  font-size: 2rem;
  color: black;
}
#header img {
  width: 125px;
  height: 125px;
  border-radius: 50%;
  border: 5px solid white;
}
.input-group {
  margin: 16px 26px 16px 26px;
  background: transparent;
}

.input-group ion-item {
  border-radius: 20px;
  margin-bottom: 10px;
  background: #fff;
  box-shadow: 1px 8px 8px 0px rgba(0, 0, 0, 0.08);
  /* border: 1px solid red; */
}
.input-group .input {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  text-align: center;
  margin-bottom: 10px;
  padding: 2px;
  background: #fff;
  box-shadow: 1px 8px 8px 0px rgba(0, 0, 0, 0.08);
}
.input-group .input ion-icon {
  font-size: 25px;
  padding-right: 20px;
}
.input-group .input ion-icon.hidden {
  opacity: 0;
}

ion-content.login ion-text {
  text-align: center;
}
.loading {
  display: block;
  margin: auto;
  width: 100px;
}
ion-button.login {
  --border-radius: 20px;
  margin: 16px 26px 16px 26px;
  width: calc(100% - 50px);
  font-weight: 700;
}

.ripple-parent {
  position: relative;
  overflow: hidden;

  border: 1px solid #fff;
}
</style>
