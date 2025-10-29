const InjectDependenciesPlugin = require('./inject-dependencies-webpack-plugin');


/**
 * When using --experimental-modules flag, @wordpress/scripts returns:
 * [defaultConfigNonModule, defaultConfigModule]
*/
const [
	defaultConfigNonModule,
	defaultConfigModule,
] = require('@wordpress/scripts/config/webpack.config');

/**
 * Configuration for custom dependencies to inject into asset files.
 * Format: { 'asset-file.php': ['dependency-handle', ...] }
 */
const customDependencies = {
	'index.asset.php': ['mermaid-library'],
	// Add more asset files and their dependencies as needed
};


// Customize non-module config: add dependency injection
const customConfigNonModule = {
	...defaultConfigNonModule,
	plugins: [
		...defaultConfigNonModule.plugins,
		new InjectDependenciesPlugin(customDependencies)
	]
};

// Module config doesn't need modification (doesn't use .asset.php files)
const customConfigModule = defaultConfigModule;

module.exports = [customConfigNonModule, customConfigModule];