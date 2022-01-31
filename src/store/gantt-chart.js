import { GanttChart } from "@/types/gantt-chart";

export const ganttChart = {
  namespaced: true,
  state: {
    ganttChart: new GanttChart(),
  },
  mutations: {
    addTask(state, task) {
      state.ganttChart.addTask(task);
    },

    removeTask(state, task) {
      state.ganttChart.removeTask(task);
    },

    addResource(state, resource) {
      state.ganttChart.addResource(resource);
    },

    removeResource(state, resource) {
      state.ganttChart.removeResource(resource);
    },

    setSettings(state, settings) {
      state.ganttChart.setSettings(settings);
    },
  },
  actions: {
    addTask({ commit }, task) {
      commit("addTask", task);
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
};
