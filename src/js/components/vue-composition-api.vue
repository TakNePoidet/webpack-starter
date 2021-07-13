<template>
	<div>
		<div>{{ article.id }}</div>
		<div>{{ isLover ? loverTitle : upperTitle }}</div>
		<button @click="clickHandle">click</button>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';

export default defineComponent({
	props: {
		article: {
			type: Object as PropType<{
				id: number;
				title: string;
			}>,
			required: true
		}
	},

	setup(props) {
		const isLover = ref(false);

		function log(text: string) {
			console.log(text);
		}
		function clickHandle(event: Event) {
			event.preventDefault();
		}

		const upperTitle = computed(() => {
			const { title } = props.article;
			const upper = title.toUpperCase();

			log(`upperTitle: ${upper}`);
			return upper;
		});
		const loverTitle = computed(() => {
			const { title } = props.article;
			const lover = title.toUpperCase();

			log(`loverTitle: ${lover}`);
			return lover;
		});

		return {
			isLover,
			log,
			clickHandle,
			upperTitle,
			loverTitle
		};
	}
});
</script>
