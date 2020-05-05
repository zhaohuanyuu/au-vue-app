<template>
	<div>
		<Detail />
		<p>{{ text }}</p>
	</div>
</template>

<script>
	import Detail from '@views/detail/detail'

	export default {
		name: 'App',
		components: {
			Detail
		},
		data() {
			return {
				text: 'To be a whale not a fish!'
			}
		},
	}
</script>

<style lang="scss" scoped>
	div{
		color: lightcoral;
	}
	p{
		padding-left: 60px;
	}
</style>