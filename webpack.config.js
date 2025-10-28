const defaultConfig = require('@wordpress/scripts/config/webpack.config');

// Plugin to ensure mermaid-library is always in dependencies
class AddMermaidDependencyPlugin {
	apply(compiler) {
		compiler.hooks.emit.tapAsync('AddMermaidDependencyPlugin', (compilation, callback) => {
			const assetFile = compilation.assets['index.asset.php'];
			if (assetFile) {
				let source = assetFile.source();

				// Add mermaid-library if not present
				if (!source.includes("'mermaid-library'")) {
					source = source.replace(
						/'dependencies' => array\((.*?)\)/s,
						(match, deps) => {
							const trimmedDeps = deps.trim();
							return trimmedDeps.length > 0
								? `'dependencies' => array(${trimmedDeps}, 'mermaid-library')`
								: `'dependencies' => array('mermaid-library')`;
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

// Handle both single config and array of configs from @wordpress/scripts
const configs = Array.isArray(defaultConfig) ? defaultConfig : [defaultConfig];

module.exports = configs.map(config => {
	// Only add the plugin to non-module configs (standard builds)
	if (!config.experiments?.outputModule) {
		return {
			...config,
			plugins: [...config.plugins, new AddMermaidDependencyPlugin()]
		};
	}

	// Return module configs unchanged (they don't use index.asset.php)
	return config;
});