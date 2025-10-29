<?php
/**
 * Plugin Name:       JuanMa Mermaid Diagram Block
 * Description:       Create beautiful diagrams and flowcharts using Mermaid syntax directly in your WordPress posts and pages.
 * Version:           0.1.0
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Author:            JuanMa Garrido <juanma.garrido@gmail.com>
 * License:           GPLv2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       juanma-mermaid-diagram-block
 *
 * @package MermaidDiagram
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 * @return void
 */
function mermaid_diagram_block_init(): void {
	// Register Mermaid as an external script module
	wp_register_script_module(
		'mermaid-library',
		'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs',
		array(),
		'10.6.1'
	);

	register_block_type( __DIR__ . '/build/' );
}
add_action( 'init', 'mermaid_diagram_block_init' );
