import { GanttChart } from "../types/gantt-chart";

export const chart = new GanttChart();

export const ganttChart = {
  namespaced: true,
  state: {
    chart,
  },
  mutations: {
    createTask(state, task) {
      state.chart.createTask(task);
    },

    removeTask(state, task) {
      state.chart.removeTask(task);
    },

    addResource(state, resource) {
      state.chart.addResource(resource);
    },

    removeResource(state, resource) {
      state.chart.removeResource(resource);
    },

    setSettings(state, settings) {
      state.chart.setSettings(settings);
    },
  },

  actions: {
    createTask({ commit }, task) {
      commit("createTask", task);
    },

    removeTask({ commit }, task) {
      commit("removeTask", task);
    },

    addResource({ commit }, resource) {
      commit("addResource", resource);
    },

    removeResource({ commit }, resource) {
      commit("removeResource", resource);
    },

    setSettings({ commit }, settings) {
      commit("setSettings", settings);
    },
  },

  getters: {
    tasks: (state) => state.chart.tasks,
    resources: (state) => state.chart.resources,
    timeline: (state) => state.chart.timeline,
    settings: (state) => state.chart.settings,

    chartJSON: (state) => state.chart.toJSON(),
  },
};
