import Vue from "vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { faCoffee } from "@fortawesome/free-solid-svg-icons";

library.add(faCoffee);

Vue.component("font-awesome-icon", FontAwesomeIcon);
