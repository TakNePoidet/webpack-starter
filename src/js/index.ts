import '../style/index.scss';

class Logger {
	static print(text: string) {
		console.log(text);
	}
}

window.addEventListener('load', () => {
	Logger.print('Load');
});
