# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a WordPress Gutenberg block plugin that allows users to create Mermaid diagrams within their posts and pages. The block uses the WordPress Interactivity API for frontend rendering and dynamic behavior.

## Development Commands

```bash
# Install dependencies
npm install

# Development build with watch mode
npm run start

# Production build
npm run build

# Format code
npm run format

# Lint JavaScript
npm run lint:js

# Lint CSS
npm run lint:css

# Create plugin zip
npm run plugin-zip

# WordPress environment commands
npm run env:start      # Start local WordPress environment
npm run env:stop       # Stop local WordPress environment
npm run env:destroy    # Destroy local WordPress environment
npm run env:clean      # Clean WordPress environment
npm run env:logs       # View environment logs
npm run env:bash       # Access environment bash shell
```

## Architecture

### Block Structure
The plugin implements a WordPress Gutenberg block with the following architecture:

1. **Server-side rendering** (`src/render.php`): Uses WordPress Interactivity API directives for dynamic frontend behavior
2. **Editor interface** (`src/edit.js`): React-based editor component with CodeMirror for syntax highlighting
3. **Frontend interaction** (`src/view.js`): Uses WordPress Interactivity API store pattern for reactive state management
4. **Block registration** (`src/block.json`): Configured with `viewScriptModule` for Interactivity API support

### WordPress Interactivity API Implementation

The block has been migrated to use the WordPress Interactivity API with:

- **Namespace**: `mermaid-diagram`
- **Context**: Manages diagram state (`isLoaded`, `hasError`, `errorMessage`, `content`, `diagramId`)
- **Actions**: `initDiagram` and `rerenderDiagram` for diagram rendering
- **Directives**: Uses `data-wp-init`, `data-wp-bind`, `data-wp-class`, and `data-wp-text` for reactive UI updates

Key directives in `render.php`:
- `data-wp-interactive="mermaid-diagram"`: Activates interactivity
- `data-wp-context`: Provides initial state
- `data-wp-init="actions.initDiagram"`: Triggers diagram rendering on mount
- `data-wp-bind--hidden`: Controls visibility based on state
- `data-wp-class`: Adds dynamic CSS classes based on state

### Mermaid Library Integration

- Mermaid.js is dynamically loaded from CDN in `view.js`
- Library loading is cached to prevent multiple loads
- Configured with security level "loose" for full diagram support

### Build System

Uses `@wordpress/scripts` with:
- ES6 modules support for Interactivity API (requires `--experimental-modules` flag)
- SCSS compilation for styles
- Automatic dependency management
- No custom webpack configuration needed
- Build commands include `--experimental-modules` for proper Interactivity API module compilation

## Interactivity API Reference

The `interactivity-api/` directory contains comprehensive documentation about the WordPress Interactivity API patterns and best practices. Key concepts to follow:

1. **Store Pattern**: Use `store()` to define actions and manage state
2. **Context Access**: Use `getContext()` within actions to access local state
3. **Element References**: Use `getElement()` to access DOM elements
4. **Async Actions**: Actions can be async functions for handling promises
5. **Error Handling**: Implement proper error states in context

## Testing Considerations

When testing Interactivity API features:
1. Ensure the block's namespace matches between PHP and JavaScript
2. Verify context is properly JSON-encoded with appropriate flags
3. Check that directives are correctly bound to context properties
4. Test error states and loading states independently

## Plugin Metadata

- **Name**: JuanMa Mermaid Diagram
- **Namespace**: `telex/block-mermaid-diagram`
- **Text Domain**: `juanma-mermaid-diagram-block`
- **Required WordPress**: 6.1+
- **Required PHP**: 7.0+