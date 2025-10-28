import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { 
	PanelBody, 
	TextareaControl, 
	Button,
	Notice,
	ToggleControl
} from '@wordpress/components';

import { useState, useEffect, useRef } from '@wordpress/element';
import mermaid from 'mermaid';

import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { content } = attributes;
	const [ showCodeEditor, setShowCodeEditor ] = useState( false );
	const [ diagramId ] = useState( `mermaid-${ Math.random().toString( 36 ).substr( 2, 9 ) }` );
	const [ renderError, setRenderError ] = useState( null );
	const diagramRef = useRef();

	const blockProps = useBlockProps( {
		className: 'mermaid-diagram-block'
	} );
// Render diagram preview
	useEffect( () => {
		if ( content && diagramRef.current ) {
			const renderDiagram = async () => {
				try {
					setRenderError( null );
					const element = diagramRef.current;
					if ( element ) {
						element.innerHTML = '';
						const { svg } = await mermaid.render( `${ diagramId }-svg`, content );
						element.innerHTML = svg;
					}
				} catch ( error ) {
					setRenderError( error.message );
				}
			};

			const timeoutId = setTimeout( renderDiagram, 300 );
			return () => clearTimeout( timeoutId );
		}
	}, [ content, diagramId ] );

	const exampleDiagrams = [
		{
			name: __( 'Simple Flowchart', 'mermaid-diagram-block-wp' ),
			code: 'graph TD\n    A[Start] --> B{Decision?}\n    B -->|Yes| C[Action 1]\n    B -->|No| D[Action 2]\n    C --> E[End]\n    D --> E'
		},
		{
			name: __( 'Sequence Diagram', 'mermaid-diagram-block-wp' ),
			code: 'sequenceDiagram\n    participant A as Alice\n    participant B as Bob\n    A->>B: Hello Bob, how are you?\n    B-->>A: Great thanks!'
		},
		{
			name: __( 'Pie Chart', 'mermaid-diagram-block-wp' ),
			code: 'pie title Sample Pie Chart\n    "Apples" : 42\n    "Oranges" : 30\n    "Bananas" : 28'
		},
		{
			name: __( 'Gantt Chart', 'mermaid-diagram-block-wp' ),
			code: 'gantt\n    title Project Timeline\n    dateFormat  YYYY-MM-DD\n    section Design\n    Research    :done, research, 2024-01-01,2024-01-10\n    Wireframes  :active, wireframes, 2024-01-11, 10d\n    section Development\n    Setup       :dev1, after wireframes, 5d\n    Coding      :dev2, after dev1, 20d'
		}
	];

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Diagram Settings', 'mermaid-diagram-block-wp' ) }>
					<div className="mermaid-diagram-controls">
						<ToggleControl
							label={ __( 'Show Code Editor', 'mermaid-diagram-block-wp' ) }
							checked={ showCodeEditor }
							onChange={ setShowCodeEditor }
							help={ showCodeEditor ? 
								__( 'Code editor is visible alongside the preview', 'mermaid-diagram-block-wp' ) :
								__( 'Only preview is visible. Toggle to show code editor.', 'mermaid-diagram-block-wp' )
							}
						/>

						{ showCodeEditor && (
							<TextareaControl
								label={ __( 'Mermaid Diagram Code', 'mermaid-diagram-block-wp' ) }
								value={ content }
								onChange={ ( newContent ) => setAttributes( { content: newContent } ) }
								rows={ 8 }
								help={ __( 'Enter your Mermaid diagram syntax here. Changes will be reflected in the preview in real-time.', 'mermaid-diagram-block-wp' ) }
							/>
						) }

						<PanelBody 
							title={ __( 'Quick Examples', 'mermaid-diagram-block-wp' ) }
							initialOpen={ false }
						>
							<p>{ __( 'Click on an example to use it:', 'mermaid-diagram-block-wp' ) }</p>
							{ exampleDiagrams.map( ( example, index ) => (
								<Button
									key={ index }
									variant="tertiary"
									onClick={ () => setAttributes( { content: example.code } ) }
									style={ { display: 'block', marginBottom: '8px', width: '100%' } }
								>
									{ example.name }
								</Button>
							) ) }
						</PanelBody>
					</div>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className={ `mermaid-diagram-layout ${ showCodeEditor ? 'with-editor' : 'preview-only' }` }>
					{ showCodeEditor && (
						<div className="mermaid-diagram-code">
							<h4>{ __( 'Diagram Code', 'mermaid-diagram-block-wp' ) }</h4>
							<TextareaControl
								value={ content }
								onChange={ ( newContent ) => setAttributes( { content: newContent } ) }
								rows={ 8 }
								placeholder={ __( 'Enter your Mermaid diagram code here...', 'mermaid-diagram-block-wp' ) }
								className="mermaid-code-input"
							/>
						</div>
					) }
					
					<div className="mermaid-diagram-preview">
						<h4>{ __( 'Live Preview', 'mermaid-diagram-block-wp' ) }</h4>
						{ renderError && (
							<Notice status="error" isDismissible={ false }>
								<strong>{ __( 'Diagram Error:', 'mermaid-diagram-block-wp' ) }</strong>
								<br />
								{ renderError }
							</Notice>
						) }
						<div 
							ref={ diagramRef }
							className="mermaid-diagram-content"
						>
							
						</div>
					</div>
				</div>
			</div>
		</>
	);
}