module.exports = {
	extends: ['taknepoidet'],
	rules: {
		'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
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
	overrides: [
		{
			files: ['*jsx', '*.tsx'],
			rules: {
				'no-use-before-define': 'off'
			}
		}
	],
	globals: {
		JSX: true
	}
};
