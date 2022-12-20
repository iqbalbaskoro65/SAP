<template>
  <ion-content @click="closeModal()" class="profile-picture">
    <img
      class="coming-soon"
      src="../assets/background/coming-soon.png"
      alt=""
    />
  </ion-content>
</template>

<script>
import { defineComponent } from "vue";
import { IonContent, modalController } from "@ionic/vue";

export default defineComponent({
  name: "ModalCs",
  components: {
    IonContent,
  },
  setup() {
    function closeModal() {
      modalController.dismiss();
    }

    return { closeModal };
  },
});
</script>

<style>
ion-content.profile-picture {
  --background: rgba(0, 0, 0, 0.55) !important;
}

img.coming-soon {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  padding: 20px;
  border-radius: 25px;
}
</style>