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
 * Enqueue Mermaid.js library on pages that contain the block
 */
function mermaid_diagram_enqueue_scripts() {
	if ( has_block( 'telex/block-mermaid-diagram' ) ) {
		wp_enqueue_script(
			'mermaid',
			plugins_url( 'assets/js/mermaid.min.js', __FILE__ ),
			array(),
			'10.6.1',
			true
		);
	}
}
add_action( 'wp_enqueue_scripts', 'mermaid_diagram_enqueue_scripts' );
