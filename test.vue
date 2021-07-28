<template>
	<input :value="text" @input="setText" />
</template>

<script>
export default {
	name: 'Test',
	data() {
		return {
			text: '1'
		};
	}
};
</script>
