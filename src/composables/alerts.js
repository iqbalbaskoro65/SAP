import { App } from "@capacitor/app";
import { alertController, toastController } from "@ionic/vue";
import { Network } from "@capacitor/network";
import router from "../router";
import ls from "localstorage-slim";

export async function confirmExit() {
  const alert = await alertController.create({
    cssClass: "my-custom-class",
    header: "Confirm!",
    message: "<strong>Confirm to Exit App??</strong>",
    mode: "ios",
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
          App.exitApp();
        },
      },
    ],
  });
  alert.present();
}
export const CheckConnection = async () => {
  const loadingScreen = ls.get("loading-screen");
  const status = await Network.getStatus();
  if (!status.connected) {
    const alert = await alertController.create({
      cssClass: "my-custom-class",
      header: "Tidak ada akses internet!!",
      mode: "ios",
      message:
        "Anda sekarang terdeteksi menggunakan mode Offline. lanjutkan mode Offline?",
      backdropDismiss: false,
      buttons: [
        {
          text: "Logout",
          role: "cancel",
          cssClass: "secondary",
          id: "cancel-button",
          handler: async () => {
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
          },
        },
        {
          text: "Lanjutkan",
          id: "confirm-button",
          handler: async () => {
            ls.set("mode", "offline", { encrypt: true });
          },
        },
      ],
    });
    alert.present();
    return true;
  } else {
    return false;
  }
};

export const tokenExpired = async (header) => {
  const url = ls.get("url");
  const loadingScreen = ls.get("loading-screen");
  const alert = await alertController.create({
    cssClass: "my-custom-class",
    header: header,
    backdropDismiss: false,
    message: "<strong>Please Login</strong>",
    mode: "ios",
    buttons: [
      {
        text: "Confirm",
        id: "confirm-button",
        handler: async () => {
          localStorage.clear();
          ls.set("url", url);
          ls.set("loading-screen", loadingScreen);
          toastV("You Signed Out", "danger");
          setTimeout(() => {
            router.push("/login");
            setTimeout(() => {
              router.push("/login");
              router.go();
            }, 500);
          }, 700);
        },
      },
    ],
  });
  alert.present();
};

export async function alertV(text, mssg) {
  const alert = await alertController.create({
    cssClass: "my-custom-class",
    mode: "ios",
    header: text,
    message: mssg,
    buttons: ["OK"],
  });
  await alert.present();
}

export async function toastV(text, color) {
  const toast = await toastController.create({
    message: text,
    duration: 2000,
    color: color,
    position: "top",
  });
  toast.present();
}
