/**
 * Re-export Mermaid as an ES module
 * This file is used to build a standalone ES module version of Mermaid
 * that can be used as an external dependency by both edit.js and view.js
 */

// Import and re-export the default export from Mermaid
import mermaid from 'mermaid';

// Export it as both default and named export for maximum compatibility
export default mermaid;
export { mermaid };