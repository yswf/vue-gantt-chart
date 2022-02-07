<template>
  <div
    class="task"
    :class="{
      interacting: task.interacting,
    }"
    :style="{
      width: `${task.width}px`,
      transform: `translate(${task.left}px, ${task.top}px)`,
      ...task.style,
    }"
    @mousedown.prevent.stop="task.moveStart($event)"
  >
    <div
      @mousedown.prevent.stop="task.resizeStart(SIDES.left, $event)"
      class="resize-handle left"
    ></div>
    <div class="task-content">
      <div class="task-name" v-text="`${task.name}`"></div>
      <div
        class="task-start"
        v-text="
          `Start: ${task.getStartDate({
            stringify: true,
          })} | Duration: ${task.getDurationString()}`
        "
      ></div>
    </div>
    <div
      @mousedown.prevent.stop="task.resizeStart(SIDES.right, $event)"
      class="resize-handle right"
    ></div>
  </div>
</template>

<script>
import { Task as TaskType } from "../../types/task";
import { SIDES } from "@/constants";

export default {
  name: "Task",

  props: {
    task: {
      type: TaskType,
      required: true,
    },
  },

  data() {
    return {
      SIDES,
    };
  },
};
</script>

<style lang="scss" scoped>
.task {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  min-width: 2px;
  opacity: 0.7;
  cursor: move;
  overflow: hidden;
  padding: 1px 0;
  box-sizing: border-box;

  &.interacting {
    opacity: 1;
    pointer-events: none;
  }

  .task-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    width: 100%;
    color: #333;
    font-size: 0.8rem;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-radius: 2px;
    padding: 4px 5px;
    box-sizing: border-box;
    background-color: #69abe3;

    .task-name {
      font-size: 0.9rem;
      font-weight: normal;
      align-self: center;
      color: #000;
    }

    .task-start {
      font-size: 0.7rem;
      font-weight: normal;
    }
  }

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
</style>
