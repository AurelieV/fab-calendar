import { createApp } from "vue";
import App from "./App.vue";

import { ModalPlugin, ResponsivePlugin, IconPlugin } from "purplefox-tools";

import "purplefox-tools/style.css";
import "./style/index.css";

createApp(App).use(ResponsivePlugin).use(IconPlugin).use(ModalPlugin).mount("#app");
