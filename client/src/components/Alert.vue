<template>
  <div
    class="alert alert-dismissible fade show"
    :class="{ 'alert-success': isSuccess, 'alert-danger': isDanger }"
  >
    {{ message }}
    <button
      type="button"
      class="btn-close"
      aria-label="Close"
      @click="close"
    ></button>
  </div>
</template>

<script>
export default {
  name: 'Alert',
  props: {
    message: String,
    isSuccess: Boolean,
    isDanger: Boolean,
    close: Function
  },
};
</script>

<style></style>
