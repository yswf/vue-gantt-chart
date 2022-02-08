<template>
  <div id="app">
    <GanttChart />
  </div>
</template>

<script>
import GanttChart from "./components/GanttChart/index.vue";

export default {
  name: "App",
  components: {
    GanttChart,
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
</style>
