<template>
  <div id="app">
    <div class="gantt-chart-wrapper">
      <div class="gantt-chart-controls">
        <span>
          <input type="checkbox" v-model="snapToGrid" id="snap-mode" />
          <label for="snap-mode">Snap to grid</label>
        </span>

        <span>
          <input type="checkbox" v-model="verbose" id="verbose" />
          <label for="verbose">Verbose</label>
        </span>
        <span>
          <select v-model="selectedTimePeriod">
            <option value="hours">Hours</option>
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
            <option value="quarters">Quarters</option>
            <option value="years">Years</option>
          </select>
        </span>
      </div>
      <GanttChart v-bind="{ chart }" />
      <pre
        v-if="verbose"
        class="gantt-chart-data"
        v-text="JSON.stringify(chartJSON, null, 2)"
      ></pre>
    </div>
  </div>
</template>

<script>
import GanttChart from "./components/GanttChart";
import { GanttChart as GanttChartClass } from "./types/gantt-chart";

export default {
  name: "App",

  components: {
    GanttChart,
  },

  data() {
    return {
      chart: new GanttChartClass(),
    };
  },

  computed: {
    chartJSON() {
      return this.chart.toJSON();
    },

    timeline() {
      return this.chart.timeline;
    },

    selectedTimePeriod: {
      get() {
        return this.timeline.timePeriod.name;
      },
      set(value) {
        this.timeline.setTimePeriod(value);
      },
    },

    verbose: {
      get() {
        return this.chart.getSetting("verbose", false);
      },
      set(value) {
        this.chart.setSettings({ verbose: value });
      },
    },

    snapToGrid: {
      get() {
        return this.chart.getSetting("snapToGrid", false);
      },
      set(value) {
        this.chart.setSettings({ snapToGrid: value });
      },
    },
  },

  mounted() {
    const resources = new Array(10).fill(0).map((_, index) => ({
      name: `Resource ${index + 1}`,
    }));

    resources.forEach((resource) => this.chart.createResource(resource));

    const tasks = [
      {
        name: "Task 1",
        start: "2022-01-12 08:00",
        end: "2022-01-14 10:00",
      },
    ];

    tasks.forEach((task) => this.chart.createTask(task));
  },
};
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  position: relative;
  height: 100%;
  width: 100%;
}

.gantt-chart-wrapper {
  display: flex;
  flex-direction: column;
  height: fit-content;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.gantt-chart-controls {
  display: flex;
  justify-self: flex-start;
  align-items: center;
  gap: 30px;
  margin-bottom: 20px;
}

.gantt-chart-data {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
}

button {
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 5px;
  font-size: 14px;

  &:focus {
    outline: none;
  }

  &:hover {
    background: #eee;
  }

  &:active {
    background: #ddd;
  }

  &.cancel {
    color: #aaa;
  }

  &.save {
    color: #000;
  }
}

select {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 5px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #000;
  }
}
</style>
