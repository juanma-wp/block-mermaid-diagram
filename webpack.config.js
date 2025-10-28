const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');
const path = require('path');

// Plugin to ensure mermaid-library is always in dependencies
class AddMermaidDependencyPlugin {
	apply(compiler) {
		compiler.hooks.emit.tapAsync('AddMermaidDependencyPlugin', (compilation, callback) => {
			const assetFile = compilation.assets['index.asset.php'];
			if (assetFile) {
				let source = assetFile.source();

				// Check if mermaid-library is already in dependencies
				if (!source.includes("'mermaid-library'")) {
					// Add mermaid-library to the dependencies array
					source = source.replace(
						/'dependencies' => array\((.*?)\)/s,
						(match, deps) => {
							const trimmedDeps = deps.trim();
							if (trimmedDeps.length > 0) {
								return `'dependencies' => array(${trimmedDeps}, 'mermaid-library')`;
							} else {
								return `'dependencies' => array('mermaid-library')`;
							}
						}
					);

					compilation.assets['index.asset.php'] = {
						source: () => source,
						size: () => source.length
					};
				}
			}
			callback();
		});
	}
}

// Since @wordpress/scripts returns an array of configs (for non-modules and modules)
// we need to handle both configurations
const configs = Array.isArray(defaultConfig) ? defaultConfig : [defaultConfig];

module.exports = configs.map((config, index) => {
	// Check if this is the module configuration (has experiments.outputModule)
	const isModuleConfig = config.experiments?.outputModule === true;

	if (!isModuleConfig) {
		// For non-module config, add our plugin to ensure mermaid-library is in dependencies
		return {
			...config,
			plugins: [...config.plugins, new AddMermaidDependencyPlugin()]
		};
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