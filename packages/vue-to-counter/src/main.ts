import App from "./App.vue";
// import App from "./AppString.vue";
// import App from "./AppDatetimeDuration.vue";
// import App from "./AppNumber.vue";
import VueToCounter from "./index";
import { createApp } from "vue";

import "./style.css";

const app = createApp(App);
app.use(VueToCounter);
app.mount("#app");
