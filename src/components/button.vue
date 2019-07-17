<template>
  <div class="item" :title="title" @click="event">
    <img v-if="url" :src="url" :title="title" />
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    event: {
      type: Function,
      default: null
    }
  },
  methods: {}
};
</script>

<style>
.item {
  width: 25px;
  height: 25px;
  text-align: center;
  padding: 5px;
}
</style>
