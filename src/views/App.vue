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
		color: lightcoral;
	}
	p{
		padding-left: 60px;
	}
</style>