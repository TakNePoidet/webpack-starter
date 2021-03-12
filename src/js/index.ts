import { createApp } from 'vue';
import AppVue from './component/app.vue';
import '~style/index.scss';

window.addEventListener('DOMContentLoaded', () => {
	createApp(AppVue).mount('#app-vue');
});
