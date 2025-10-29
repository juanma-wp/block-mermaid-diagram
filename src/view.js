/**
 * WordPress Interactivity API implementation for Mermaid Diagram block
 */

import { store, getContext, getElement } from '@wordpress/interactivity';
import mermaid from 'mermaid-library';

console.log("view.js loaded");
console.log("view - Mermaid object:", mermaid);
console.log("view - Interactivity API:", { store, getContext, getElement });

// Initialize mermaid with secure settings
await mermaid.initialize({
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
	callbacks: {
		init: async () => {
			console.log("init...	");
		},
		initDiagram: async () => {
			console.log("initDiagram...	");
			console.log("view - initDiagram - Mermaid object:", mermaid);
			const context = getContext();
			const { ref } = getElement();	
			const container = ref.querySelector('.mermaid-rendered');

			if (!container || !context.content) {
				return;
			}

			try {
				const { svg } = await mermaid.render(
					`${context.diagramId}-svg`,
					context.content
				);

				container.innerHTML = svg;
				const svgElement = container.querySelector('svg');
				if (svgElement) {
					svgElement.style.maxWidth = '100%';
					svgElement.style.height = 'auto';
				}

				context.isLoaded = true;
				context.hasError = false;
				context.showDiagram = true;
			} catch (error) {
				console.error('Mermaid rendering error:', error);
				context.hasError = true;
				context.errorMessage = error.message || 'Failed to render diagram';
				context.isLoaded = false;
				context.showDiagram = false;
			}
		}
	}
});