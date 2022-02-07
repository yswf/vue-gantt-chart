<template>
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
        <!-- select time period -->
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
    <div class="gantt-chart" @mousewheel="scale" :style="cssVars">
      <div class="gantt-resources">
        <div
          class="gantt-resource"
          v-for="resource in resources"
          :key="resource.id"
          v-text="resource.name"
        ></div>
        <div class="gantt-resource">
          <button style="width: 100%; height: 100%" @click="newResource">
            +
          </button>
        </div>
      </div>
      <div
        class="gantt-timeline"
        :id="timeline.id"
        @scroll="preventTaskSpawn"
        @mousedown="taskSpawnStart"
      >
        <div class="gantt-timeunits-primary">
          <div
            class="gantt-timeunit-primary"
            :style="{
              width: `${unit.width}px`,
              transform: `translateX(${unit.left}px)`,
            }"
            v-for="unit in timelineData.primary"
            :key="unit.name"
            v-text="unit.name"
          ></div>
        </div>
        <div class="gantt-timeunits-secondary">
          <div
            class="gantt-timeunit-secondary"
            :style="{ width: `${unit.width}px` }"
            v-for="(unit, index) in timelineData.secondary"
            :key="`time-unit-${unit.name}-${index}`"
            v-text="unit.name"
          ></div>
        </div>
        <div class="tasks">
          <Task
            v-for="task in filteredTasks"
            :key="`task-${task.id}`"
            v-bind="{ task }"
          />
        </div>
      </div>
    </div>
    <pre
      v-if="verbose"
      class="gantt-chart-data"
      v-text="JSON.stringify(chartJSON, null, 2)"
    ></pre>
  </div>
</template>

<script>
import Task from "./Task.vue";

import { SIDES } from "@/constants";

import { mapState, mapActions, mapGetters } from "vuex";
import { DEFAULT_DATE_FORMAT } from "../../constants";
import { Resource } from "../../types/resource";

export default {
  name: "GanttChart",

  components: {
    Task,
  },

  computed: {
    ...mapState("ganttChart", { chart: "chart" }),
    ...mapGetters("ganttChart", {
      tasks: "tasks",
      resources: "resources",
      timeline: "timeline",
      settings: "settings",
      chartJSON: "chartJSON",
    }),

    cssVars() {
      return {
        "--gantt-time-unit-width": `${this.timeline.TIME_UNIT_WIDTH}px`,
        "--gantt-timeline-max-width": `${this.timelineMaxWidth}px`,
      };
    },

    timelineData() {
      return this.timeline.getTimePeriod();
    },

    filteredTasks() {
      return this.tasks.filter((task) => task.visible);
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
        return this.settings.verbose;
      },
      set(value) {
        this.setSettings({ verbose: value });
      },
    },

    snapToGrid: {
      get() {
        return this.settings.snapToGrid;
      },
      set(value) {
        this.setSettings({ snapToGrid: value });
      },
    },
  },

  data() {
    return {
      SIDES,

      taskSpawnData: null,
    };
  },

  mounted() {
    const tasks = [
      {
        name: "Task 1",
        start: "2022-01-12 08:00",
        end: "2022-01-14 10:00",
      },
    ];

    const resources = [
      new Resource({
        name: "Resource 1",
      }),
    ];

    resources.forEach((resource) => this.addResource(resource));
    tasks.forEach((task) => this.createTask(task));
  },

  methods: {
    ...mapActions("ganttChart", {
      createTask: "createTask",
      addResource: "addResource",
      setSettings: "setSettings",
    }),

    newResource() {
      this.addResource(new Resource({ name: "New resource" }));
    },

    scale(event) {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();

      const delta = event.deltaY;

      if (delta > 0) {
        this.timeline.changeTimePeriod(1);
      } else {
        this.timeline.changeTimePeriod(-1);
      }
    },

    taskSpawnStart(event) {
      const date = this.timeline.getDateFromPosition(event.clientX);

      this.taskSpawnData = {
        initialCall: true,
        date,
        event,
      };

      document.addEventListener("mousemove", this.taskSpawn);
      document.addEventListener(
        "mouseup",
        () => {
          window.removeEventListener("mousemove", this.taskSpawn);
          this.taskSpawnData = null;
        },
        { once: true }
      );
    },

    taskSpawn(event) {
      if (!this.taskSpawnData?.initialCall) return;

      const date = this.taskSpawnData.date;
      const start = date.format(DEFAULT_DATE_FORMAT).toString();
      const end = date.add(1, "minute").format(DEFAULT_DATE_FORMAT).toString();

      const task = this.chart.createTask({
        name: "New task",
        start,
        end,
      });

      task.resizeStart(SIDES.right, event);

      this.taskSpawnData.initialCall = false;
    },

    preventTaskSpawn() {
      this.taskSpawnData = null;
    },
  },
};
</script>

<style lang="scss" scoped>
$timeunit-height: 30px;

.gantt-chart-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.gantt-chart-controls {
  display: flex;
  justify-self: flex-start;
  gap: 30px;
  margin-left: 110px;
  margin-bottom: 20px;
}

.gantt-chart-data {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
  margin-left: 110px;
}

.gantt-chart {
  display: flex;
  justify-content: center;
}

.gantt-resources {
  padding-top: 42px;
  width: 100px;
  border: 1px solid #ccc;
  margin-bottom: 18px;

  .gantt-resource {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    border: 1px solid #ccc;
  }
}

.gantt-timeline {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: calc(min(100%, 800px));
  overflow: auto;
  border-top: 1px solid #ccc;
  border-right: 1px solid #ccc;

  &::-webkit-scrollbar-thumb {
    background-clip: content-box;
    max-width: 10px;
  }

  .gantt-timeunits-primary {
    position: relative;
    height: $timeunit-height;
    width: 100%;

    .gantt-timeunit-primary {
      position: absolute;
      text-align: center;
      height: 30px;
    }
  }

  .gantt-timeunits-secondary {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: $timeunit-height;

    .gantt-timeunit-secondary {
      padding: 5px;
      width: var(--gantt-time-unit-width);
      text-align: center;
      font-size: 0.8rem;
      color: #999;
      box-sizing: border-box;

      border: 1px solid #eee;
    }
  }
}

.tasks {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
