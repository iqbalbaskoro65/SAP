<template>
  <div v-if="mode == 'offline'" class="offline">Mode Offline</div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import ls from "localstorage-slim";
export default defineComponent({
  name: "App",
  components: {},
  setup() {
    const mode = ref();
    onMounted(async () => {
      const connection = ls.get("mode", { decrypt: true });
      mode.value = connection;
    });
    return {
      mode,
    };
  },
});
</script>

<style></style>
