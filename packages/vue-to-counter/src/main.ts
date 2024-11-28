// import App from "./AppDatetimeDuration.vue";
import App from "./AppNumber.vue";
import VueToCounter from "./index.ts";
import { createApp } from "vue";

const app = createApp(App);
app.use(VueToCounter);
app.mount("#app");
