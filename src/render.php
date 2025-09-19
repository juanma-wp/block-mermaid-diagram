<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

$content = $attributes['content'] ?? 'graph TD\n    A[Start] --> B[End]';
$wrapper_attributes = get_block_wrapper_attributes();
?>

<div <?php echo $wrapper_attributes; ?>>
	<div class="mermaid-diagram-container" data-mermaid="<?php echo esc_attr( $content ); ?>">
		<div class="mermaid-loading">
			<?php esc_html_e( 'Loading diagram...', 'mermaid-diagram-block-wp' ); ?>
		</div>
	</div>
</div>
