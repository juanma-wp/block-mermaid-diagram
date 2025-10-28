/**
 * WordPress Interactivity API implementation for Mermaid Diagram block
 */

import { store, getContext, getElement } from '@wordpress/interactivity';
import mermaid from 'mermaid-esm';

// Initialize mermaid once
mermaid.initialize({
	startOnLoad: false,
	theme: 'default',
	securityLevel: 'loose',
	flowchart: {
		useMaxWidth: true,
		htmlLabels: true,
		curve: 'basis'
	}
});

store('mermaid-diagram', {
	actions: {
		/**
		 * Initialize and render the Mermaid diagram
		 * Called via data-wp-init directive
		 */
		async initDiagram() {
			const context = getContext();
			const { ref } = getElement();
			const container = ref.querySelector('.mermaid-rendered');

			if (!container || !context.content) return;

			try {
				// Render diagram
				const { svg } = await mermaid.render(
					`${context.diagramId}-svg`,
					context.content
				);

				// Insert SVG and make responsive
				container.innerHTML = svg;
				const svgElement = container.querySelector('svg');
				if (svgElement) {
					svgElement.style.maxWidth = '100%';
					svgElement.style.height = 'auto';
				}

				// Update state
				context.isLoaded = true;
			} catch (error) {
				console.error('Mermaid rendering error:', error);
				context.hasError = true;
				context.errorMessage = error.message || 'Failed to render diagram';
			}
		}
	}
});