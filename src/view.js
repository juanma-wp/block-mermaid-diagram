/**
 * WordPress Interactivity API implementation for Mermaid Diagram block
 */

import { store, getContext, getElement } from '@wordpress/interactivity';
import mermaid from 'mermaid';

console.log('View.js loaded');
console.log('Mermaid object:', mermaid);
console.log('Store function:', store);

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
			console.log('initDiagram called');
			const context = getContext();
			const { ref } = getElement();
			console.log('Context:', context);
			console.log('Element ref:', ref);
			const container = ref.querySelector('.mermaid-rendered');

			if (!container || !context.content) {
				console.log('Container or content missing', { container, content: context?.content });
				return;
			}

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

				// Update state - Interactivity API will handle visibility automatically
				context.isLoaded = true;
				context.hasError = false;
				context.showDiagram = true;
				console.log('Diagram loaded successfully, showDiagram:', context.showDiagram);
			} catch (error) {
				console.error('Mermaid rendering error:', error);
				// Update state - Interactivity API will handle visibility automatically
				context.hasError = true;
				context.errorMessage = error.message || 'Failed to render diagram';
				context.isLoaded = false;
				context.showDiagram = false;
			}
		}
	}
});