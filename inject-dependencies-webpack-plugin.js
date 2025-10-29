/**
 * Webpack plugin to inject custom dependencies into WordPress block asset files.
 *
 * This plugin allows you to add custom script handles as dependencies to your
 * WordPress block's asset files, ensuring they're loaded before your block scripts.
 *
 * @example
 * const InjectDependenciesPlugin = require('./inject-dependencies-webpack-plugin');
 *
 * new InjectDependenciesPlugin({
 *   'index.asset.php': ['my-custom-script', 'another-dependency'],
 *   'other.asset.php': ['different-script']
 * })
 */
class InjectDependenciesPlugin {
	/**
	 * @param {Object} dependencies - Object mapping asset file names to arrays of dependency handles
	 */
	constructor(dependencies = {}) {
		this.dependencies = dependencies;
	}

	apply(compiler) {
		compiler.hooks.emit.tapAsync('InjectDependenciesPlugin', (compilation, callback) => {
			Object.entries(this.dependencies).forEach(([assetName, deps]) => {
				const assetFile = compilation.assets[assetName];

				if (assetFile) {
					let source = assetFile.source();

					// Ensure deps is an array
					const depsArray = Array.isArray(deps) ? deps : [deps];

					depsArray.forEach(dep => {
						// Check if dependency already exists
						if (!source.includes(`'${dep}'`)) {
							// Add dependency to the PHP array
							source = source.replace(
								/'dependencies' => array\((.*?)\)/s,
								(match, existingDeps) => {
									const trimmed = existingDeps.trim();
									const newDep = `'${dep}'`;

									// Add new dependency to the array
									return trimmed.length > 0
										? `'dependencies' => array(${trimmed}, ${newDep})`
										: `'dependencies' => array(${newDep})`;
								}
							);
						}
					});

					// Update the compilation asset
					compilation.assets[assetName] = {
						source: () => source,
						size: () => source.length
					};
				}
			});

			callback();
		});
	}
}

module.exports = InjectDependenciesPlugin;