const [
	defaultConfigNonModule,
	defaultConfigModule,
] = require( '@wordpress/scripts/config/webpack.config' );
const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );
const path = require( 'path' );

module.exports = [
	// Default WordPress build configuration
	defaultConfigNonModule,
	// WordPress module configuration
	{
		...defaultConfigModule,
		// Configure externals to use our local Mermaid module build
		externals: {
			'mermaid-library': 'mermaid-library',
		},
		externalsType: 'module',
		plugins: [
			...defaultConfigModule.plugins.filter(
				( plugin ) =>
					plugin.constructor.name !==
					'DependencyExtractionWebpackPlugin'
			),
			new DependencyExtractionWebpackPlugin( {
				// With modules, use `requestToExternalModule`:
				requestToExternalModule( request ) {
					if ( request === 'mermaid-library' ) {
						return 'mermaid-library';
					}
				},
			} ),
		],
	},
	// Separate build just for Mermaid as an ES module
	{
		entry: {
			'mermaid-module': path.resolve( process.cwd(), 'src/mermaid-export.js' ),
		},
		output: {
			path: path.resolve( process.cwd(), 'build' ),
			filename: '[name].js',
			library: {
				type: 'module',
			},
			module: true,
			chunkFormat: 'module',
		},
		experiments: {
			outputModule: true,
		},
		optimization: {
			// We want a single file output
			splitChunks: false,
			runtimeChunk: false,
		},
		module: {
			rules: [
				{
					test: /\.m?js$/,
					resolve: {
						fullySpecified: false,
					},
				},
			],
		},
		resolve: {
			extensions: [ '.js', '.mjs', '.json' ],
		},
		plugins: [],
	},
];