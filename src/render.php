<?php
/**
 * Block render callback using Interactivity API.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

// Get block attributes
$content = $attributes['content'] ?? 'graph TD\n    A[Start] --> B[End]';
$unique_id = wp_unique_id( 'mermaid-' );

// Prepare wrapper classes
$wrapper_classes = [];
if ( ! empty( $attributes['align'] ) ) {
	$wrapper_classes[] = 'align' . $attributes['align'];
}

// Set up the interactive block wrapper with directives
$wrapper_attributes = get_block_wrapper_attributes([
	'class' => implode( ' ', $wrapper_classes ),
	'data-wp-interactive' => 'mermaid-diagram',
	'data-wp-context' => wp_json_encode([
		'diagramId' => $unique_id,
		'content' => $content,
		'isLoaded' => false,
		'hasError' => false,
		'errorMessage' => ''
	], JSON_HEX_QUOT | JSON_HEX_TAG )
]);
?>

<div <?php echo wp_kses_data( $wrapper_attributes ); ?>>
	<div
		class="mermaid-diagram-container"
		data-wp-bind--id="context.diagramId"
		data-wp-init="actions.initDiagram"
		data-wp-class--mermaid-loaded="context.isLoaded"
		data-wp-class--mermaid-error-state="context.hasError"
	>
		<div
			class="mermaid-loading"
			data-wp-bind--hidden="context.isLoaded"
			aria-live="polite"
			aria-busy="true"
		>
			<span class="mermaid-loading-spinner" aria-hidden="true"></span>
			<span class="mermaid-loading-text">
				<?php esc_html_e( 'Loading diagram...', 'juanma-mermaid-diagram-block' ); ?>
			</span>
		</div>
		<div
			class="mermaid-error"
			data-wp-bind--hidden="!context.hasError"
			role="alert"
		>
			<strong><?php esc_html_e( 'Diagram Error:', 'juanma-mermaid-diagram-block' ); ?></strong>
			<br>
			<code class="mermaid-error-message" data-wp-text="context.errorMessage"></code>
		</div>
		<div
			class="mermaid-rendered"
			data-wp-bind--hidden="!context.isLoaded || context.hasError"
			data-wp-class--mermaid-rendered-visible="context.isLoaded && !context.hasError"
			role="img"
			aria-label="<?php esc_attr_e( 'Mermaid diagram', 'juanma-mermaid-diagram-block' ); ?>"
		></div>
	</div>
</div>
