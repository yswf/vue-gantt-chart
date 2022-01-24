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
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
