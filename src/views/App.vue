<template>
  <div>
    <p class="text">{{ text }}</p>
  </div>
</template>

<script>

export default {
  name: "App",
  data() {
    return {
      result: 0,
      text: "To be a whale not just a fish!"
    };
  }
};
</script>

<style lang="scss" scoped>
	div{
		color: $color-coral;
    p{
      margin-top: 10%;
      padding-left: 60px;
      text-align: center;
      font-size: 32px;
    }
	}
</style>