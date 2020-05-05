<template>
	<div>
		<Detail />
		<p>{{ text }}</p>
	</div>
</template>

<script>
	import Detail from './detail/detail'

	export default {
		name: 'App',
		components: {
			Detail
		},
		data() {
			return {
				text: 'This is App Page'
			}
		},
	}
</script>

<style scoped>
	div{
		color: lightcoral;
	}
	p{
		padding-left: 60px;
	}
</style>