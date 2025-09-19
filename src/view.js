
  /**
 * Frontend JavaScript for Mermaid Diagram block
 * Initializes and renders Mermaid diagrams on the frontend
 */

document.addEventListener('DOMContentLoaded', function() {
	// Initialize Mermaid when the library is loaded
	if (typeof mermaid !== 'undefined') {
		mermaid.initialize({
			startOnLoad: false,
			theme: 'default',
			securityLevel: 'loose',
			flowchart: {
				useMaxWidth: true,
				htmlLabels: true
			}
		});

		// Find all mermaid diagram blocks and render them
		const mermaidBlocks = document.querySelectorAll('.wp-block-telex-block-mermaid-diagram .mermaid-diagram-container');
		
		mermaidBlocks.forEach(function(block, index) {
			const diagramCode = block.getAttribute('data-mermaid');
			const diagramId = 'mermaid-diagram-' + index;
			
			if (diagramCode) {
				// Create a unique ID for this diagram
				block.id = diagramId;
				
				// Render the diagram
				mermaid.render(diagramId + '-svg', diagramCode)
					.then(function(result) {
						block.innerHTML = result.svg;
					})
					.catch(function(error) {
						console.error('Mermaid rendering error:', error);
						block.innerHTML = '<div class="mermaid-error"><strong>Diagram Error:</strong><br>' + 
							'<code>' + error.message + '</code></div>';
					});
			}
		});
	} else {
		console.error('Mermaid library not loaded');
	}
});
	