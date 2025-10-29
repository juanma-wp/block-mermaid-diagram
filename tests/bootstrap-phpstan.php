<?php
/**
 * PHPStan bootstrap file for WordPress plugin analysis
 *
 * This file defines WordPress constants and functions that PHPStan needs
 * to know about when analyzing the code.
 */

// Define WordPress constants
define( 'ABSPATH', __DIR__ . '/' );
define( 'WP_DEBUG', false );
define( 'WP_CLI', false );

// Define plugin constants
define( 'MERMAID_DIAGRAM_VERSION', '1.0.0' );
define( 'MERMAID_DIAGRAM_PLUGIN_DIR', dirname( __DIR__ ) . '/' );
define( 'MERMAID_DIAGRAM_PLUGIN_URL', 'https://example.com/wp-content/plugins/mermaid-diagram-block/' );