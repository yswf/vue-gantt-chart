<template>
  <div class="gantt-chart" @mousewheel="zoom" :style="cssVars">
    <Modal :modal="taskSpawnModal">
      <div class="modal-task-spawn">
        <input type="text" v-model="taskSpawnModal.taskName" />
        <input type="text" v-model="taskSpawnModal.taskStart" />
        <input type="text" v-model="taskSpawnModal.taskEnd" />
        <div class="actions">
          <button class="cancel" @click="spawnTaskModalActionCancel">
            Cancel
          </button>
          <button class="save" @click="spawnTaskModalActionSave">Save</button>
        </div>
      </div>
    </Modal>
    <header class="gantt-header">
      <div class="time-spacer"></div>
      <div class="time-wrapper">
        <div
          class="time"
          :style="{
            transform: `translateX(-${timeline.getScrollLeft()}px)`,
          }"
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
              v-for="(unit, index) in timelineData.secondary"
              :key="`time-unit-${unit.name}-${index}`"
              v-text="unit.name"
            ></div>
          </div>
        </div>
      </div>
    </header>

    <div class="gantt-workspace">
      <div class="gantt-resources">
        <div
          v-for="resource in resources"
          :key="resource.id"
          class="gantt-resource"
          :class="resource.classes"
          :id="resource.id"
          :style="{
            height: `${resource.getHeightPx()}px`,
          }"
          v-text="resource.name"
        ></div>
        <div class="gantt-resource">
          <button
            style="width: 100%; height: 50px; border-radius: 0; border: none"
            @click="chart.createResource({ name: 'New Resource' })"
          >
            +
          </button>
        </div>
      </div>

      <div
        class="gantt-timeline"
        :id="timeline.id"
        @mousedown="taskSpawnStart"
        :ref="timeline.id"
      >
        <div class="gantt-timeline-dividers">
          <div
            class="divider-v"
            :class="{ emphasize: divider.emphasize }"
            v-for="divider in timelineData.dividersV"
            :key="`dv-${divider.left}`"
            :style="{
              transform: `translateX(${divider.left - timelineScrollLeft}px)`,
            }"
          ></div>
          <div
            class="divider-h"
            :class="{ emphasize: divider.emphasize }"
            v-for="divider in timelineData.dividersH"
            :key="`dh-${divider.top}`"
            :style="{
              width: `${timelineData.totalWidth}px`,
              transform: `translateY(${divider.top}px)`,
            }"
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
    <footer class="gantt-chart-footer">
      <div
        class="virtual-scroll-wrapper"
        @scroll="scroll"
        @mousedown="toggleAnimations(false)"
        @mouseup="toggleAnimations(true)"
        ref="virtualScroll"
      >
        <div
          class="virtual-scroll"
          :style="{ width: `${timelineData.totalWidth}px`, height: '20px' }"
        ></div>
      </div>
    </footer>
  </div>
</template>

<script>
import Task from "./Task.vue";
import Modal from "./Modal.vue";

import { SIDES } from "@/constants";
import { DEFAULT_DATE_FORMAT } from "../../constants";
import { GanttChart } from "../../types/gantt-chart";
import moment from "moment";

export default {
  name: "GanttChart",

  components: {
    Modal,
    Task,
  },

  props: {
    chart: {
      type: GanttChart,
      required: true,
    },
  },

  data() {
    return {
      SIDES,

      taskSpawnData: null,
      taskSpawnModal: {
        shown: false,
        style: {
          width: "210px",
        },
        title: "Edit task data",

        taskName: "",
        taskStart: "",
        taskEnd: "",
      },
    };
  },

  computed: {
    tasks() {
      return this.chart.tasks;
    },
    resources() {
      return this.chart.resources;
    },
    timeline() {
      return this.chart.timeline;
    },

    chartJSON() {
      return this.chart.toJSON();
    },

    cssVars() {
      return {
        "--gantt-time-unit-width": `${this.timeline.TIME_UNIT_WIDTH}px`,
        "--gantt-task-height": `${this.timeline.TASK_HEIGHT}px`,
        "--gantt-resources-height": `${this.chart.getTotalResourcesHeight()}px`,
      };
    },

    timelineScrollLeft() {
      return this.timeline.getScrollLeft();
    },

    timelineData() {
      return this.timeline.timePeriodData;
    },

    filteredTasks() {
      return this.tasks.filter((task) => task.isVisible());
    },
  },

  mounted() {
    this.syncVirtualScroll();
  },

  methods: {
    zoom(event) {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();

      const delta = event.deltaY;

      if (delta > 0) {
        this.timeline.setTimePeriodOffset(1);
      } else {
        this.timeline.setTimePeriodOffset(-1);
      }

      this.syncVirtualScroll();
    },

    scroll(event) {
      this.timeline.scrollTo(event.target.scrollLeft);
    },

    syncVirtualScroll() {
      const virtualScroll = this.$refs.virtualScroll;
      virtualScroll.scrollLeft = this.timeline.getScrollLeft();
    },

    toggleAnimations(value) {
      if (value == undefined) {
        value = !this.chart.getSetting("tasksAnimations", true);
      }

      this.chart.setSettings({ tasksAnimations: Boolean(value) });
    },

    /* -------------------------------------------------------------------------- */
    /*                             task spawn handlers                            */
    /* -------------------------------------------------------------------------- */

    getTimelineRef() {
      const timeline = this.$refs[this.timeline.id];
      if (!timeline) {
        if (this.chart.getSetting("verbose", false)) {
          console.warn(`No timeline found with id "${this.timeline.id}"`);
        }
        return null;
      }
      return timeline;
    },

    //? Why use mousemove instead of mousedown/mouseup?
    //? This approach improves UX by preventing
    //? the user from accidentally creating a task
    taskSpawnStart(event) {
      const timeline = this.getTimelineRef();
      if (!timeline) return;

      const timelineRect = timeline.getBoundingClientRect();
      const startDate = this.timeline.getDateFromPosition(
        event.clientX - timelineRect.left
      );

      this.taskSpawnData = {
        startX: event.clientX,
        startY: event.clientY,
        firstCall: true,
        startDate,
      };

      document.addEventListener("mousemove", this.taskSpawn);
      document.addEventListener("mouseup", this.taskSpawnEnd, { once: true });
    },

    taskSpawn(event) {
      if (!this.taskSpawnData?.firstCall) return;

      const startX = this.taskSpawnData.startX;
      const diff = event.clientX - startX;
      const threshold = 20;
      if (Math.abs(diff) < threshold) return;

      const timeline = this.getTimelineRef();
      if (!timeline) return;

      const timelineRect = timeline.getBoundingClientRect();
      const startDate = this.timeline.getDateFromPosition(
        startX + diff - timelineRect.left
      );
      const start = startDate.format(DEFAULT_DATE_FORMAT).toString();
      const end = startDate
        .add(1, "minute")
        .format(DEFAULT_DATE_FORMAT)
        .toString();

      let y = Math.floor(
        (this.taskSpawnData.startY - timelineRect.top) /
          this.timeline.TASK_HEIGHT
      );
      if (y < 0) y = 0;
      else if (y >= this.resources.length - 1) y = this.resources.length - 1;

      const task = this.chart.createTask({
        name: "New task",
        start,
        end,
        y,
      });

      this.taskSpawnData.task = task;

      task.resizeStart(SIDES.right, event, {
        resizeEndCallback: this.spawnTaskModalShow,
      });

      this.taskSpawnData.firstCall = false;
    },

    taskSpawnEnd() {
      window.removeEventListener("mousemove", this.taskSpawn);
      if (this.taskSpawnData?.firstCall) this.taskSpawnCancel();
    },

    taskSpawnCancel() {
      if (this.taskSpawnData?.task) {
        this.taskSpawnData.task.remove();
      }

      this.taskSpawnData = null;
    },

    spawnTaskModalShow() {
      const task = this.taskSpawnData?.task;
      if (!task) return;

      Object.assign(this.taskSpawnModal, {
        shown: true,
        taskName: task.name,
        taskStart: task.getStartString(),
        taskEnd: task.getEndString(),
      });
    },

    /* -------------------------------------------------------------------------- */
    /*                               modals actions                               */
    /* -------------------------------------------------------------------------- */

    spawnTaskModalActionCancel() {
      this.taskSpawnModal.shown = false;

      this.taskSpawnCancel();
    },

    spawnTaskModalActionSave() {
      this.taskSpawnModal.shown = false;

      const modalData = this.taskSpawnModal;

      this.taskSpawnData.task.name = modalData.taskName;
      this.taskSpawnData.task.start = moment(modalData.taskStart).unix();
      this.taskSpawnData.task.end = moment(modalData.taskEnd).unix();

      this.taskSpawnData = null;
    },
  },
};
</script>

<style lang="scss" scoped>
$timeunit-height: 30px;
$gantt-header-height: $timeunit-height * 2;
$gantt-footer-height: 16.8px;
$resource-bar-width: 220px;

$divider-height: 1px;
$divider-width: 1px;
$divider-color: #eee;
$divider-color-emphasis: #ddd;

.modal-task-spawn {
  display: flex;
  flex-direction: column;

  input {
    width: 200px;
    margin-bottom: 10px;
  }

  .actions {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 10px;
    gap: 15px;
  }
}

.gantt-chart {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.gantt-header {
  border: 1px solid #ccc;
  position: relative;
  display: flex;
  flex: 0 0 $gantt-header-height;
  box-sizing: border-box;

  .time-spacer {
    flex: 0 0 $resource-bar-width;
    border-right: 1px solid #ccc;
    box-sizing: border-box;
  }

  .time-wrapper {
    overflow: hidden;
    position: relative;
  }

  .gantt-timeunits-primary {
    position: relative;
    width: 100%;
    height: $timeunit-height;
    line-height: $timeunit-height;

    .gantt-timeunit-primary {
      position: absolute;
      text-align: center;
      height: 30px;
      box-sizing: border-box;
      border-bottom: 1px solid #eee;
      user-select: none;

      &:not(:last-child) {
        border-right: 1px solid $divider-color;
      }
    }
  }

  .gantt-timeunits-secondary {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: $timeunit-height;

    .gantt-timeunit-secondary {
      flex: 0 0 var(--gantt-time-unit-width);
      text-align: center;
      font-size: 0.8rem;
      color: #999;
      box-sizing: border-box;
      height: $timeunit-height;
      line-height: $timeunit-height;
      user-select: none;

      &:not(:last-child) {
        border-right: 1px solid $divider-color;
      }
    }
  }
}

.gantt-workspace {
  position: relative;
  display: flex;
  flex-direction: row;
  flex: 1 1 0%;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
}

.gantt-resources {
  flex: 0 0 $resource-bar-width;
  height: fit-content;

  .gantt-resource {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: var(--gantt-task-height);
    transition: all 0.2s ease-in-out;
    border-right: 1px solid #ccc;
    border-left: 1px solid #ccc;
    box-sizing: border-box;
    border-bottom: 1px solid #ccc;

    &.task-target {
      background-color: #d6d5d5;
    }
  }
}

.gantt-timeline {
  position: relative;
  width: 100%;
  height: var(--gantt-resources-height);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #ccc;
}

.gantt-timeline-dividers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--gantt-resources-height);

  .divider-v,
  .divider-h {
    position: absolute;
    background-color: $divider-color;
    z-index: -1;

    &.emphasize {
      background-color: $divider-color-emphasis;
    }
  }

  .divider-v {
    width: $divider-width;
    height: 100vh;
    top: 0;
  }

  .divider-h {
    left: 0;
    height: $divider-height;
    width: 100%;
  }
}

.tasks {
  position: relative;
  width: 100%;
  height: var(--gantt-resources-height);
}

.gantt-chart-footer {
  flex: 0 0 $gantt-footer-height;
  position: relative;
  padding-left: $resource-bar-width;

  .virtual-scroll-wrapper {
    position: relative;
    height: $gantt-footer-height;
    width: 100%;
    overflow: auto;
  }
}

input {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 5px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #000;
  }
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
