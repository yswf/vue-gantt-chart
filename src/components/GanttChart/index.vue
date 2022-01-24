<template>
  <div class="gantt-chart">
    <div style="margin-right: 20px; display: flex; flex-direction: column">
      <span>
        <input type="checkbox" v-model="snapToDays" id="snap-mode" />
        <label for="snap-mode">Snap to days</label>
      </span>

      <span>
        <input type="checkbox" v-model="verbose" id="verbose" />
        <label for="verbose">Verbose</label>
      </span>
    </div>
    <div class="gantt-resources">
      <div class="gantt-resource">Resource 1</div>
      <div class="gantt-resource">Resource 2</div>
      <div class="gantt-resource">Resource 3</div>
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
            left: `${task.left}px`,
            ...task.style,
          }"
          @mousedown.prevent.stop="taskMove(task, $event)"
        >
          <div
            @mousedown.prevent.stop="taskResize(task, SIDES.left, $event)"
            class="resize-handle left"
          ></div>
          <div class="task-name" v-text="task.name"></div>
          <div class="task-dates">
            <div
              class="task-date"
              v-for="date in task.dates"
              :key="`date-${date}`"
              v-text="date"
            ></div>
          </div>
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

export default {
  name: "GanttChart",

  data() {
    return {
      SIDES,

      currentMonth: moment().format("MMMM"),
      currentMonthDays: moment().daysInMonth(),
      tasks: [
        new Task({
          id: 1,
          name: "Task 1",
          startDay: 5,
          endDay: 15,
        }),
        new Task({
          id: 2,
          name: "Task 2",
          startDay: 10,
          endDay: 20,
          style: { backgroundColor: "wheat" },
        }),
      ],

      snapToDays: false,
      verbose: false,
    };
  },

  watch: {
    verbose(value) {
      this.tasks.forEach((task) => task.setVerbose(value));
    },
  },

  methods: {
    taskResize(task, side, event) {
      task.resizeStart(side, event, {
        snapToDays: this.snapToDays,
      });
    },

    taskMove(task, event) {
      task.moveStart(event, {
        snapToDays: this.snapToDays,
      });
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
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .task {
    position: relative;
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
