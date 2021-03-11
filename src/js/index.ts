import '../style/index.scss';
// eslint-disable-next-line import/no-extraneous-dependencies
import vue from 'vue';

console.log(vue);
class Logger {
	static print(text: string) {
		console.log(text);
	}
}

window.addEventListener('load', () => {
	Logger.print('Load');
});
