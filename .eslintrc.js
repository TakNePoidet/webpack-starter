module.exports = {
	extends: ['taknepoidet'],
	rules: {
		'import/extensions': [
			'error',
			'always',
			{
				jsx: 'never',
				js: 'never',
				ts: 'never',
				tsx: 'never'
			}
		]
	},
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.scss', '.sass', '.ts', '.js', '.tsx', '.jsx']
			},
			webpack: {
				config: './build/prod.webpack.config.js',
				env: {
					NODE_ENV: 'local',
					production: true
				}
			}
		}
	},
	globals: {
		JSX: true
	}
};
