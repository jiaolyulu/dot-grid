import Setting              from './Setting'
import DotGridPattern       from './DotGridPattern'
import DotRects             from './DotRects'
import { useState, useRef } from 'react'

export interface SizeInterface {width:number, height:number, margin:number, widthOnDrag:number, heightOnDrag:number, drag:boolean}
const SvgPage = () =>{
    const [ size, setSize ]= useState<SizeInterface>( { width:900, height:600, margin:0, widthOnDrag:900, heightOnDrag:600, drag:false } )
    const { innerWidth: width, innerHeight: height } = window
    const [ position, setPosition ] = useState( new Array( 4 ).fill( {
        x:0,
        y:0,
        active: false,
        originPos: { },
    } ) )
    const gridNode = { value:{ x:0, y:0, width:size.width, height:size.height }, left:null, right:null, top: null, bottom:null }
    const [ grids, setGrids ]=useState<{x:number, y:number, width:number, height:number}[]>( [ { x:0, y:0, width:size.width, height:size.height } ] )
    const highlightBorderTimeout = useRef( [] )
    const highlightBorderRef = useRef<SVGPathElement[][]>( [] )
    const handlePointerDown = ( e, index:number ) => {
        setSize( { ...size, drag:true } )
        const el = e.target
        const bbox = e.target.getBoundingClientRect()
        const x = e.clientX -bbox.width/2
        const y = e.clientY -bbox.height/2
        
        el.setPointerCapture( e.pointerId )
        const newPosition = [ ...position ]
        newPosition[ index ]={
            ...position[ index ],
            active: true,
            x,
            y,
            originPos: {
                x,
                y,
            },
        } 
        setPosition( newPosition )
    }
    const handlePointerMove = ( e, index:number ) => {
        const bbox = e.target.getBoundingClientRect()
        const x = e.clientX -bbox.width/2
        const y = e.clientY -bbox.height/2
        if ( position[ index ].originPos.x && position[ index ].originPos.y ){
        
            if ( position[ index ].active ) {
                const newPosition = [ ...position ]
                newPosition[ index ]={
                    ...position[ index ],
                    x,
                    y,
                } 
                setPosition( newPosition )
            
            }
            if( size.drag ){
                const widthOnDrag = Math.floor( Math.abs( x-width/2 )*2/50 )*50
                const heightOnDrag = Math.floor( Math.abs( y-height/2 )*2/50 )*50
                console.log( widthOnDrag, heightOnDrag )
                setSize( { ...size, widthOnDrag, heightOnDrag } )

            }

        }
        
    }
    const handlePointerUp = ( e, index:number ) => {
        const newPosition = [ ...position ]
        newPosition[ index ]={
            ...position[ index ],
            active: false,
        } 
        setPosition( newPosition )
        setSize( { ...size, drag:false, width:size.widthOnDrag, height:size.heightOnDrag } )
    }

    const [ dragPosition, setDragPosition ] = React.useState( {
        x: 100,
        y: 100,
        active: false,
        offset: { },
    } )
    
    const handleDragPointerDown = e => {
        const el = e.target
        const bbox = e.target.getBoundingClientRect()
        const x = e.clientX - bbox.left
        const y = e.clientY - bbox.top
        el.setPointerCapture( e.pointerId )
        setPosition( {
            ...position,
            active: true,
            offset: {
                x,
                y,
            },
        } )
    }
    const handleDragPointerMove = e => {
        const bbox = e.target.getBoundingClientRect()
        const x = e.clientX - bbox.left
        const y = e.clientY - bbox.top
        if ( position.active ) {
            setPosition( {
                ...position,
                x: position.x - ( position.offset.x - x ),
                y: position.y - ( position.offset.y - y ),
            } )
        }
    }
    const handleDragPointerUp = e => {
        setPosition( {
            ...position,
            active: false,
        } )
    }
    
    return(
        <div className="w-screen h-screen bg-white flex-box overflow-hidden ">
            <Setting size={ size } setSize={ setSize } />
            <div className='w-full h-full flex-box'>
                <div style={ { width:width, height:height } }>
                    
                    <svg width={ width } height={ height } viewBox={ `0 0 ${width} ${height}` }>
                        <rect width={ width } height={ height } className='fill-slate-300'></rect>
                        
                        <svg width={ size.width }height={ size.height } x={ ( width-size.width )/2 } y={ ( height-size.height )/2 }>
                            <defs>
                                <DotGridPattern margin={ size.margin } />
                            </defs>
                            <DotRects width={ size.width-2*size.margin } height={ size.height-2*size.margin } margin={ size.margin } />
                        </svg>
                        <svg x={ ( width-size.widthOnDrag )/2 } y={ ( height-size.heightOnDrag )/2 } width={ size.widthOnDrag }height={ size.heightOnDrag }>
                            {[ 'M0 15 0 0 15 0', 
                                `M0 ${size.heightOnDrag-15} 0 ${size.heightOnDrag} 15 ${size.heightOnDrag}`, 
                                `M${size.widthOnDrag} 15 ${size.widthOnDrag} 0  ${size.widthOnDrag-15 } 0`, 
                                `M${size.widthOnDrag} ${size.heightOnDrag-15} ${size.widthOnDrag} ${size.heightOnDrag} ${size.widthOnDrag-15 } ${size.heightOnDrag}`, 
                            ].map( ( d )=>( 
                                <path
                                    key={ d }
                                    d={ d } 
                                    strokeWidth='4'
                                    className='stroke-blue-500'
                                    fill="none"
                                    
                                ></path>
                            ) )}
                            <rect width={ size.widthOnDrag }height={ size.heightOnDrag } x={ 0 } y={ 0 } className='fill-slate-400 opacity-10' />
                        </svg>
                        
                        {[ [ ( width-size.width )/2, ( height-size.height )/2 ], [ ( width-size.width )/2, size.height+( height-size.height )/2 ], [ ( width-size.width )/2+size.width, ( height-size.height )/2 ], [ ( width-size.width )/2+size.width, size.height+( height-size.height )/2 ] ].map( ( d, index )=>( 
                            <rect
                                width={ 80 }
                                height={ 80 }
                                x={ position[ index ].active?position[ index ].x :d[ 0 ]-40 }
                                y={ position[ index ].active?position[ index ].y :d[ 1 ]-40 }
                                onPointerDown={ ( e )=> {handlePointerDown( e, index ) } }
                                onPointerMove={ ( e )=> { handlePointerMove( e, index ) } }
                                onPointerUp={ ( e )=> { handlePointerUp( e, index )} }
                                fillOpacity={ 0 }
                                    
                            ></rect>
                        ) )}
                        <svg width={ size.width }height={ size.height } x={ ( width-size.width )/2 } y={ ( height-size.height )/2 }>
                            {grids.map( ( { x, y, width, height }, gridIndex )=>(
                                <g>
                                    {[ { x, y, width:10, height, x1:x, y1:y, x2:x, y2:y+height }, 
                                        { x, y:y+height-10, width, height:10, x1:x, y1:y+height, x2:x+width, y2:y+height }, 
                                        { x, y, width, height:10, x1:x, y1:y, x2:x+width, y2:y }, 
                                        { x:width-10, y, width:10, height, x1:width, y1:y, x2:width, y2:y+height }, 
                                    ].map( ( config, lineIndex )=>( 
                                        <g>
                                            <rect
                                                x={ config.x }
                                                y={ config.y }
                                                width={ config.width }
                                                height={ config.height } 
                                                fill={ 'blue' } 
                                                fillOpacity={ 0 } 
                                                onPointerOver={ ( event )=>{
                                                    highlightBorderRef.current[ gridIndex ][ lineIndex ].style.strokeOpacity='0.3'
                                                } }
                                                onPointerOut={ ( event )=>{
                                                    if ( gridIndex in highlightBorderTimeout.current &&highlightBorderTimeout.current[ gridIndex ][ lineIndex ] ) {
                                                        clearTimeout( highlightBorderTimeout.current[ gridIndex ][ lineIndex ] )
                                                    }
                                                    if ( !highlightBorderTimeout.current[ gridIndex ] ) {
                                                        highlightBorderTimeout.current[ gridIndex ] = []
                                                    }
                                                    highlightBorderTimeout.current[ gridIndex ][ lineIndex ] = setTimeout( ()=>{
                                                        highlightBorderRef.current[ gridIndex ][ lineIndex ].style.strokeOpacity='0'
                                                    }, 1000 )
                                                } }
                                            
                                            ></rect>
                                            <path
                                                d ={ `M${config.x1} ${config.y1} ${config.x2} ${config.y2}` }
                                                stroke='blue'
                                                strokeWidth={ 4 }
                                                strokeOpacity={ 0 }
                                                ref={ ( currentRef )=>{
                                                    if ( !highlightBorderRef.current[ gridIndex ] ) {
                                                        highlightBorderRef.current[ gridIndex ] = []
                                                    }
                                                    highlightBorderRef.current[ gridIndex ][ lineIndex ]= currentRef!
                                                } }
                                            ></path>
                                        </g> ), 
                                    )}
                                </g>
                            ) )}
                        </svg>
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default SvgPage