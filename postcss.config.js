module.exports = {
	plugins: {
		autoprefixer: {},
		cssnano: {
			preset: [
				'default',
				{
					discardComments: {
						removeAll: true
					}
				}
			]
		}
	},
	sourceMap: true
};
