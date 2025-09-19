
=== Mermaid Diagram ===

Contributors:      WordPress Telex
Tags:              block, diagram, mermaid, flowchart, visualization
Tested up to:      6.8
Stable tag:        0.1.0
License:           GPLv2 or later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Create beautiful diagrams and flowcharts using Mermaid syntax directly in your WordPress posts and pages.

== Description ==

The Mermaid Diagram block allows you to create professional-looking diagrams, flowcharts, sequence diagrams, Gantt charts, and more using simple text-based Mermaid syntax. Perfect for technical documentation, process flows, system architectures, and educational content.

**Features:**
* Support for all Mermaid diagram types (flowcharts, sequence diagrams, class diagrams, state diagrams, Gantt charts, pie charts, and more)
* Live preview in the block editor
* Syntax highlighting for better code readability
* Responsive diagrams that work on all devices
* Clean, professional rendering using the latest Mermaid.js library
* Easy-to-use interface with helpful examples

**Supported Diagram Types:**
* Flowcharts and graphs
* Sequence diagrams
* Class diagrams
* State diagrams
* Entity relationship diagrams
* User journey diagrams
* Gantt charts
* Pie charts
* Git graphs
* And many more!

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/mermaid-diagram` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Use the Mermaid Diagram block in the Gutenberg editor
4. Start creating beautiful diagrams with simple text syntax!

== Frequently Asked Questions ==

= What is Mermaid? =

Mermaid is a JavaScript-based diagramming and charting tool that uses Markdown-inspired text definitions to create diagrams dynamically. It's widely used in documentation and technical writing.

= Do I need to know programming to use this? =

No! Mermaid uses simple, human-readable syntax. For example, to create a flowchart:
```
graph TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    B -->|No| D[End]
```

= Can I customize the appearance of diagrams? =

Yes! You can use Mermaid's theming system and custom styling within your diagram code to control colors, fonts, and other visual aspects.

= Are the diagrams responsive? =

Yes, all diagrams are fully responsive and will adapt to different screen sizes automatically.

== Screenshots ==

1. Adding a Mermaid diagram block in the Gutenberg editor
2. Live preview of a flowchart diagram in the editor
3. Beautiful rendered diagram on the frontend
4. Example of a sequence diagram

== Changelog ==

= 0.1.0 =
* Initial release
* Support for all Mermaid diagram types
* Live preview in editor
* Syntax highlighting
* Responsive diagram rendering

== Examples ==

Here are some quick examples to get you started:

**Simple Flowchart:**
```
graph TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[fa:fa-car Car]
```

**Sequence Diagram:**
```
sequenceDiagram
    Alice->>Bob: Hello Bob, how are you?
    Bob-->>John: How about you John?
    Bob--x Alice: I am good thanks!
    Bob-x John: I am good thanks!
```

**Pie Chart:**
```
pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
```
