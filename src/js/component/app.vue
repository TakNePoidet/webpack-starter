<template lang="pug">
link(
	rel='stylesheet',
	href='//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.6.0/styles/vs2015.min.css'
)
p запуск сервера в режиме разработки
pre
	code.language-bash yarn start

p запуск сервера в продакшен режиме
pre
	code.language-bash yarn build

p форматирование и проверка кода
pre
	code.language-bash
		| yarn lint # поверка JavaScript, TypeScript и Vue
		| yarn stylelint # форматирование стилей
		| yarn htmlhint # форматирование html
		| yarn prettier # форматирование кода
		| yarn beautifier # запуск всех команд для форматирования

p герерация svg спрайта
pre
	code.language-bash yarn svg-sprite

p анализ размера сборки
pre
	code.language-bash yarn analyzer

p публикация на Github Pages
pre
	code.language-bash yarn deploy

p
	small альтернативный синтаксис
	pre
		code.language-bash npm run &lt;script&gt;
</template>

<script>
export default {
	data() {
		return {
			script: null
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
		this.script.parentElemet.remove(this.script);
	}
};
</script>
