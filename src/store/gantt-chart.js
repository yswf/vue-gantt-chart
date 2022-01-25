import { DAY_WIDTH_PX, RESOURCE_HEIGHT_PX } from "@/constants";

export const ganttChart = {
  namespaced: true,
  state: {
    tasks: [],
    resources: [],
    settings: {
      snapTasksToGrid: false,

      verbose: false,
      dayWidthPx: DAY_WIDTH_PX,
      resourceHeightPx: RESOURCE_HEIGHT_PX,
    },
  },
  mutations: {
    addTask(state, task) {
      state.tasks.push(task);
    },

    removeTask(state, task) {
      const index = state.tasks.indexOf(task);
      if (index > -1) {
        state.tasks.splice(index, 1);
      }
    },

    addResource(state, resource) {
      state.resources.push(resource);
    },

    removeResource(state, resource) {
      const index = state.resources.indexOf(resource);
      if (index > -1) {
        state.resources.splice(index, 1);
      }
    },

    setSettings(state, settings) {
      for (const key in settings) {
        if (Object.prototype.hasOwnProperty.call(state.settings, key)) {
          state.settings[key] = settings[key];
        }
      }
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
