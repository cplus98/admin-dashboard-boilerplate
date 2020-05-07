const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
	env: {
		GRAPHQL_URI: isDevelopment ? 'http://localhost:3000/graphql' : 'http://service_address/graphql',
	},
	webpack: (config, options) => {
		const { isServer } = options;
		if (!isServer) {
			config.node = {
				...(config.node || {}),
				fs: 'empty',
				net: 'empty',
				tls: 'empty',
				// dns: 'empty',
			};
		}

		config.module.rules.push({
			test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
			use: {
				loader: 'url-loader',
			},
		});

		config.resolve.extensions.push('.ts', '.tsx');

		// Set typescript paths
		if (config.resolve.plugins) {
			config.resolve.plugins.push(new TsconfigPathsPlugin());
		} else {
			config.resolve.plugins = [new TsconfigPathsPlugin()];
		}

		return config;
	},
};
