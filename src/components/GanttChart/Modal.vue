<template>
  <div class="gantt-modal-wrapper" v-if="modal.shown">
    <div class="gantt-modal" :style="modal.style">
      <h3 class="title" v-if="modal.title" v-text="modal.title"></h3>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",

  props: {
    modal: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.gantt-modal-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;

  .gantt-modal {
    position: relative;
    width: 100%;
    max-width: 500px;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    padding: 20px;

    .title {
      margin-top: 0;
    }
  }
}
</style>
