<template>
  <div>
    <Detail />
    <p class="text">{{ text }}</p>
  </div>
</template>

<script>
// import Detail from "@views/detail/detail";

export default {
  name: "App",
  components: {
    Detail
  },
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