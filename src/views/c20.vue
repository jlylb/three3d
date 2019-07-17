<template>
  <div class="box">
    <btn-group></btn-group>
  </div>
</template>

<script>
import btnGroup from "@/components/buttons";

export default {
  components: { btnGroup },

  mounted() {}
};
</script>

<style>
.box {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
</style>
