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
 * @return void
 */
function mermaid_diagram_block_init(): void {
	register_block_type( __DIR__ . '/build/' );
}
add_action( 'init', 'mermaid_diagram_block_init' );

/**
 * Enqueue Mermaid.js library for the frontend only when the block is present.
 * This ensures the library is only loaded when actually needed.
 *
 * @return void
 */
function mermaid_diagram_enqueue_frontend_assets(): void {

	// Check if the block is present on the current page.
	if ( has_block( 'juanma/block-mermaid-diagram' ) ) {
		wp_enqueue_script(
			'mermaid-library',
			plugins_url( 'assets/js/mermaid.min.js', __FILE__ ),
			array(),
			'10.6.1',
			false
		);
	}
}
add_action( 'enqueue_block_assets', 'mermaid_diagram_enqueue_frontend_assets' );
