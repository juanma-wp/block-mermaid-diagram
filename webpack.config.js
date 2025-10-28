const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');
const path = require('path');

// Since @wordpress/scripts returns an array of configs (for non-modules and modules)
// we need to handle both configurations
const configs = Array.isArray(defaultConfig) ? defaultConfig : [defaultConfig];

module.exports = configs.map((config, index) => {
	// Check if this is the module configuration (has experiments.outputModule)
	const isModuleConfig = config.experiments?.outputModule === true;

	if (!isModuleConfig) {
		// Return non-module config as-is
		return config;
	}

	// For the module config, we need to customize the DependencyExtractionWebpackPlugin
	return {
		...config,
		resolve: {
			...config.resolve,
			alias: {
				...config.resolve?.alias,
				// Don't alias lodash-es, let webpack bundle it
			}
		},
		plugins: [
			// Filter out the default DependencyExtractionWebpackPlugin
			...config.plugins.filter(
				plugin => plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
			),
			// Add our custom DependencyExtractionWebpackPlugin
			new DependencyExtractionWebpackPlugin({
				// Use the type: 'module' for module scripts
				useDefaults: false,
				requestToHandle: (request) => {
					// Don't handle lodash-es or mermaid - let webpack bundle them
					if (request.includes('lodash-es') || request === 'mermaid') {
						return null;
					}
					// Handle WordPress dependencies normally
					if (request.startsWith('@wordpress/')) {
						return request;
					}
					return null;
				},
				requestToExternalModule: (request) => {
					// Only externalize WordPress packages as modules
					if (request.startsWith('@wordpress/')) {
						return `module ${request}`;
					}
					return null;
				}
			})
		]
	};
});