import Vue from "vue";
import Vuex from "vuex";
import { ganttChart } from "./gantt-chart";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: { ganttChart },
});
