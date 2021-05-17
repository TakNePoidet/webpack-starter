<template>
	<div>
		<div>{{ article.id }}</div>
		<div>{{ isLover ? loverTitle : upperTitle }}</div>
		<button @click="clickHandle">click</button>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		article: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			isLover: false
		};
	},
	computed: {
		upperTitle(): string {
			const { title } = this.article;
			const upper = title.toUpperCase();

			this.log(`upperTitle: ${upper}`);
			return upper;
		},
		loverTitle(): string {
			const { title } = this.article;
			const lover = title.toUpperCase();

			this.log(`loverTitle: ${lover}`);
			return lover;
		}
	},
	methods: {
		log(text: string) {
			console.log(text);
		},
		clickHandle(event: Event) {
			event.preventDefault();
		}
	}
});
</script>
