import Vue from "vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import {
  faPause,
  faPlay,
  faRedo,
  faTimes
} from "@fortawesome/free-solid-svg-icons";

library.add([faPause, faPlay, faRedo, faTimes]);

Vue.component("font-awesome-icon", FontAwesomeIcon);
