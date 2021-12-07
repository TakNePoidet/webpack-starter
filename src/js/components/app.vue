<template lang="pug">
p Запуск сервера в режиме разработки
pre
	code.language-bash yarn start

p Запуск сервера в продакшен режиме
pre
	code.language-bash yarn build

p Форматирование и проверка кода
pre
	code.language-bash
		| npm run lint # поверка JavaScript, TypeScript и Vue
		| npm run stylelint # форматирование стилей
		| npm run htmlhint # форматирование html
		| npm run prettier # форматирование кода
		| npm run beautifier # запуск всех команд для форматирования

p Генерация svg спрайта
pre
	code.language-bash npm run svg-sprite

p Анализ размера сборки
pre
	code.language-bash npm run analyzer

p Публикация на Github Pages
pre
	code.language-bash npm run deploy

pre
	code.language-bash npm run &lt;script&gt; #альтернативный синтаксис
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	data() {
		return {
			script: null as HTMLScriptElement | null
		};
	},
	mounted() {
		this.script = document.createElement('script');
		this.script.onload = () => {
			document.querySelectorAll('pre code').forEach((block) => {
				// eslint-disable-next-line no-undef
				hljs.highlightBlock(block);
			});
		};

		this.script.src = `//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.6.0/highlight.min.js`;
		document.body.appendChild(this.script);
	},
	beforeUnmount() {
		if (this.script) {
			this.script.remove();
		}
	}
});
</script>
