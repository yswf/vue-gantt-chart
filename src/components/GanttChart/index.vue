<template>
  <div class="gantt-chart">
    <div style="margin-right: 20px; display: flex; flex-direction: column">
      <span>
        <input type="checkbox" v-model="snapTasksToGrid" id="snap-mode" />
        <label for="snap-mode">Snap to days</label>
      </span>

      <span>
        <input type="checkbox" v-model="verbose" id="verbose" />
        <label for="verbose">Verbose</label>
      </span>
    </div>
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
    <div class="gantt-dates">
      <div class="month" v-text="currentMonth"></div>
      <div class="days">
        <div
          class="day"
          v-for="day in currentMonthDays"
          :key="`day-${day}`"
          v-text="day"
        ></div>
      </div>
      <div class="tasks">
        <div
          class="task"
          v-for="task in tasks"
          :key="`task-${task.id}`"
          :style="{
            width: `${task.width}px`,
            transform: `translate(${task.left}px, ${task.y}px)`,
            ...task.style,
          }"
          @mousedown.prevent.stop="taskMove(task, $event)"
        >
          <div
            @mousedown.prevent.stop="taskResize(task, SIDES.left, $event)"
            class="resize-handle left"
          ></div>
          <div class="task-name" v-text="`${task.name}`"></div>
          <div
            @mousedown.prevent.stop="taskResize(task, SIDES.right, $event)"
            class="resize-handle right"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { SIDES } from "@/constants";
import { Task } from "@/types/task";

import { mapState, mapActions } from "vuex";
import { Resource } from "../../types/resource";

export default {
  name: "GanttChart",

  computed: {
    ...mapState("ganttChart", {
      tasks: "tasks",
      resources: "resources",
      settings: "settings",
    }),

    verbose: {
      get() {
        return this.settings.verbose;
      },
      set(value) {
        this.setSettings({ verbose: value });
      },
    },

    snapTasksToGrid: {
      get() {
        return this.settings.snapTasksToGrid;
      },
      set(value) {
        this.setSettings({ snapTasksToGrid: value });
      },
    },
  },

  data() {
    return {
      SIDES,

      currentMonth: moment().format("MMMM"),
      currentMonthDays: moment().daysInMonth(),
    };
  },

  watch: {
    verbose(value) {
      this.tasks.forEach((task) => task.setVerbose(value));
    },
  },

  mounted() {
    const tasks = [
      new Task({
        name: "Task 1",
        start: 5,
        end: 15,
      }),
      new Task({
        name: "Task 2",
        start: 10,
        end: 20,
        y: 1,
        style: { backgroundColor: "wheat" },
      }),
    ];

    const resources = [
      new Resource({
        name: "Resource 1",
      }),
    ];

    resources.forEach((resource) => this.addResource(resource));
    tasks.forEach((task) => {
      if (task.y > this.resources.length) {
        task.y = 0;
      }
      this.addTask(task);
    });
  },

  methods: {
    ...mapActions("ganttChart", {
      addTask: "addTask",
      addResource: "addResource",
      setSettings: "setSettings",
    }),
    taskResize(task, side, event) {
      task.resizeStart(side, event, {
        snapTasksToGrid: this.snapTasksToGrid,
      });
    },

    taskMove(task, event) {
      task.moveStart(event, {
        snapTasksToGrid: this.snapTasksToGrid,
      });
    },

    newResource() {
      this.addResource(new Resource({ name: "New resource" }));
    },
  },
};
</script>

<style lang="scss" scoped>
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

.gantt-dates {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: calc(min(100%, 800px));
  overflow: auto;

  .days {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .day {
      padding: 5px;
      width: 30px;
      text-align: center;
      font-size: 0.8rem;
      color: #999;

      border: 1px solid #eee;
    }
  }
}

.tasks {
  position: relative;
  width: 100%;
  height: 100%;

  .task {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    min-width: 42px;
    background-color: #69abe3;
    cursor: move;

    .resize-handle {
      z-index: 1;
      cursor: col-resize;
      position: absolute;
      width: 10px;
      top: 0;
      bottom: 0;
      height: 100%;
      cursor: col-resize;

      &.left {
        left: 0;
      }

      &.right {
        right: 0;
      }
    }
  }
}
</style>
