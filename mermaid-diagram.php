<?php
/**
 * Plugin Name:       JuanMa Mermaid Diagram
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
 */
function mermaid_diagram_block_init() {
	register_block_type( __DIR__ . '/build/' );
}
add_action( 'init', 'mermaid_diagram_block_init' );

/**
 * Register Mermaid.js as a module for use with Interactivity API
 */
function mermaid_diagram_register_modules() {
	// Register Mermaid ESM module
	wp_register_script_module(
		'mermaid-esm',
		plugin_dir_url( __FILE__ ) . 'assets/js/mermaid.esm.min.mjs',
		array(),
		'10.9.0'
	);

	// The view script module will import this when needed
	// No need to enqueue it directly as it's imported by view.js
}
add_action( 'init', 'mermaid_diagram_register_modules' );