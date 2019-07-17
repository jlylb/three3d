<template>
  <div class="btn-group">
    <button-item
      v-for="(item, index) in btnItems"
      :key="index"
      :title="item.title"
      :url="item.url"
      :event="item.event||defaultClick"
    ></button-item>
  </div>
</template>

<script>
import ButtonItem from "./button";
export default {
  components: { ButtonItem },
  // inject: ["camera"],
  props: {
    items: {
      type: Array,
      default() {
        return [];
      }
    }
    // camera: {
    //   type: Object,
    //   default: null
    // }
  },
  data() {
    return {
      btnItems: [
        { title: "edit", url: require("../assets/edit.png") },
        { title: "reset", url: require("../assets/reset.png") },

        { title: "connection", url: require("../assets/connection.png") },
        { title: "alarm", url: require("../assets/alarm.png") },

        { title: "air", url: require("../assets/air.png") },
        { title: "fps", url: require("../assets/fps.png") },

        { title: "power", url: require("../assets/power.png") },
        { title: "security", url: require("../assets/security.png") },

        { title: "smoke", url: require("../assets/smoke.png") },
        { title: "space", url: require("../assets/space.png") },

        { title: "temperature", url: require("../assets/temperature.png") },
        {
          title: "usage",
          url: require("../assets/usage.png"),
          event: this.usageClick
        },

        {
          title: "water",
          url: require("../assets/water.png"),
          event: this.defaultClick
        }
      ]
    };
  },
  methods: {
    defaultClick() {
      console.log(111111111);
    },
    usageClick() {
      const camera = this.$parent.camera;
      if (!camera) return;
      camera.layers.toggle(1);
      camera.layers.toggle(2);
    }
  },
  mounted() {}
};
</script>

<style>
.btn-group {
  position: absolute;
  display: flex;
}
</style>
