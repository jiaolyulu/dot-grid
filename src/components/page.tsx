import Setting                                     from './Setting'
import DotGridPattern                              from './DotGridPattern'
import DotRects                                    from './DotRects'
import { useState, useRef, useMemo, PointerEvent } from 'react'
import { Tooltip }                                 from '@mui/material'
import { snapTo50 }                                from '../utils/snap'

export interface SizeInterface {width:number, height:number, margin:number, widthOnDrag:number, heightOnDrag:number, drag:boolean}
interface GridNodeInterface { value:{ x:number, y:number, width:number, height:number }, left?:GridNodeInterface, right?:GridNodeInterface, top?: GridNodeInterface, bottom?:GridNodeInterface }
interface LineInfoInterface {x:number, y:number, width:number, height:number, type:'horizontal'|'vertical', x1:number, y1:number, x2:number, y2:number}
interface GridInterface {x:number, y:number, width:number, height:number, nodeHead:GridNodeInterface}
const SvgPage = () =>{
    const svgRef = useRef<SVGSVGElement>( null )
    const [ size, setSize ]= useState<SizeInterface>( { width:900, height:600, margin:0, widthOnDrag:900, heightOnDrag:600, drag:false } )
    const { innerWidth: width, innerHeight: height } = window
    const [ position, setPosition ] = useState( new Array( 4 ).fill( {
        x:0,
        y:0,
        active: false,
        originPos: { } } ) )

    const gridNode = useRef<{root:GridNodeInterface}>( { root:{ value:{ x:0, y:0, width:size.width, height:size.height } } } )
    const currentNode = useRef( gridNode.current.root )
    const [ grids, setGrids ]=useState<GridInterface[]>( [ { x:0, y:0, width:size.width, height:size.height, nodeHead:currentNode.current } ] )
    const highlightBorderTimeout = useRef<number[][]>( [] )
    const highlightBorderRef = useRef<SVGPathElement[][]>( [] )
    const handlePointerDown = ( e:PointerEvent, index:number ) => {
        setSize( { ...size, drag:true } )
        const el = e.target as SVGRectElement
        const bbox = el.getBoundingClientRect()
        const x = e.clientX -bbox.left+bbox.width/2
        const y = e.clientY -bbox.top+bbox.height/2
        
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
    const handlePointerMove = ( e:PointerEvent, index:number ) => {
        const el = e.target as SVGRectElement
        const bbox = el.getBoundingClientRect()
        const x = e.clientX -bbox.width/2+bbox.width/2
        const y = e.clientY -bbox.height/2+bbox.height/2
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
                const widthOnDrag = snapTo50( Math.abs( x-width/2 )*2 )
                const heightOnDrag = snapTo50( Math.abs( y-height/2 )*2 )
                console.log( widthOnDrag, heightOnDrag )
                setSize( { ...size, widthOnDrag, heightOnDrag } )

            }

        }
        
    }
    const handlePointerUp = ( _e:PointerEvent, index:number ) => {
        const newPosition = [ ...position ]
        newPosition[ index ]={
            ...position[ index ],
            active: false,
        } 
        setPosition( newPosition )
        setSize( { ...size, drag:false, width:size.widthOnDrag, height:size.heightOnDrag } )
        if( grids.length ===1 ){
            //
        }
        
    }
    const getGridInfo=( { x, y }:GridInterface )=>{
        const gridInfo: LineInfoInterface[]= [ { x, y, width:10, height, x1:x, y1:y, x2:x, y2:y+height, type:'vertical' }, 
            { x, y:y+height-10, width, height:10, x1:x, y1:y+height, x2:x+width, y2:y+height, type:'horizontal' }, 
            { x, y, width, height:10, x1:x, y1:y, x2:x+width, y2:y, type:'horizontal' }, 
            { x:x+width-10, y, width:10, height, x1:x+width, y1:y, x2:x+width, y2:y+height, type:'vertical' }, 
        ]
        return gridInfo
    }
    const [ gridLines, setGridLines ] =useState<LineInfoInterface[]>( [] )

    const[ activeGridLine, setActiveGridLine ] = useState<{gridIndex:number, lineIndex:number, active:boolean}>( { gridIndex:0, lineIndex:0, active:false } )
    const [ currentDragPosition, setCurrentDragPosition ]=useState<{x:number, y:number}>( { x:0, y:0 } )
    const activeLineConfig=useMemo( ()=>{
        const originalConfig = getGridInfo( grids[ activeGridLine.gridIndex ] )[ activeGridLine.lineIndex ]
        const lineConfig = { ...originalConfig }
        const { type }= originalConfig
        if ( type==='horizontal' ){
            lineConfig.y1=snapTo50( currentDragPosition.y )
            lineConfig.y2=snapTo50( currentDragPosition.y )
        }else{
            lineConfig.x1=snapTo50( currentDragPosition.x )
            lineConfig.x2=snapTo50( currentDragPosition.x )
        }
        return lineConfig
    }, [ grids, activeGridLine, currentDragPosition ] )

    const addGrid=( currentGrid:GridInterface[], node:GridNodeInterface )=>{
        
        currentGrid.push( { ...node.value, nodeHead:node } )
        if ( node.left ){
            addGrid( currentGrid, node.left )
        }
        if ( node.right ){

            addGrid( currentGrid, node.right )
        }
        if ( node.top ){
            addGrid( currentGrid, node.top )
        }
        if ( node.bottom ){
            addGrid( currentGrid, node.bottom )
        }
        return

    }
    const traverseTreeNode=()=>{
        const currentGrid :GridInterface[]= []
        addGrid( currentGrid, gridNode.current.root )
        
        setGrids( currentGrid )

    }
    const handleDragPointerUp=( )=>{
        setGridLines( [ ...gridLines, activeLineConfig ] )
        setActiveGridLine( { ...activeGridLine, active:false } )
        const { type } =activeLineConfig
        const{ value }=currentNode.current
        const { x, y, width, height }=value
        if( type==='horizontal' ){
            currentNode.current.top={ value:{ x, y, width, height:activeLineConfig.y1-y } }
            currentNode.current.bottom={ value:{ x, y:activeLineConfig.y1+1, width, height:height-activeLineConfig.y1 } }
        }
        if( type==='vertical' ){
            currentNode.current.left={ value:{ x, y, width:activeLineConfig.x1-x, height } }
            currentNode.current.right={ value:{ x:activeLineConfig.x1-x+1, y, width:width-activeLineConfig.x1, height } }
        }
        traverseTreeNode()

    }
    
    const handleDragPointerMove = ( e:PointerEvent )=>{
        
        const bbox = svgRef.current!.getBoundingClientRect()
        const x = e.clientX -bbox.left
        const y = e.clientY -bbox.top
        setCurrentDragPosition( { x, y } )
    }

    // useEffect( ()=>{
    //     window.addEventListener( 'pointermove', handleDragPointerMove )
    //     window.addEventListener( 'pointerup', handleDragPointerUp )
    //     return()=>{
    //         console.log( 'remove' )
    //         window.removeEventListener( 'pointermove', handleDragPointerMove )
    //         window.removeEventListener( 'pointerup', handleDragPointerUp )

    //     }
    // }, [] )
    
    return(
        <div className="w-screen h-screen bg-white flex-box overflow-hidden " onPointerMove={ handleDragPointerMove } onPointerUp={ handleDragPointerUp }>
            <Setting size={ size } setSize={ setSize } />
            <div className='w-full h-full flex-box'>
                <div style={ { width:width, height:height } }>
                    <Tooltip title="Add" placement="bottom">
                        <div>bottom</div>
                    </Tooltip>
                    
                    <svg
                        width={ width }
                        height={ height }
                        viewBox={ `0 0 ${width} ${height}` }
                        
                    >
                        <rect width={ width } height={ height } className='fill-slate-300'></rect>
                        
                        <svg
                            width={ size.width }
                            height={ size.height }
                            x={ ( width-size.width )/2 }
                            y={ ( height-size.height )/2 }
                            ref={ svgRef }
                            
                        >
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
                            {grids.map( ( gridInfo, gridIndex )=>(
                                <g>
                                    {
                                        getGridInfo( gridInfo ).map( ( lineInfo, lineIndex )=>{
                                            const config =lineInfo
                                            return( 
                                                <g>
                                                    <rect
                                                        x={ config.x }
                                                        y={ config.y }
                                                        width={ config.width }
                                                        height={ config.height } 
                                                        fill={ 'blue' } 
                                                        fillOpacity={ 0.1 } 
                                                        onPointerDown ={ ()=>{
                                                            currentNode.current = gridInfo.nodeHead
                                                            setActiveGridLine( { active:true, gridIndex, lineIndex } )
                                                        } }
                                                        onPointerOver={ ( )=>{
                                                            console.log( 'onPointerOver', highlightBorderRef.current[ gridIndex ][ lineIndex ] )
                                                            highlightBorderRef.current[ gridIndex ][ lineIndex ].style.strokeOpacity='0.3'
                                                            setActiveGridLine( { gridIndex, lineIndex, active:true } )
                                                    
                                                        } }
                                                        
                                                        onPointerOut={ ( )=>{
                                                            if ( gridIndex in highlightBorderTimeout.current && highlightBorderTimeout.current[ gridIndex ][ lineIndex ] ) {
                                                                clearTimeout( highlightBorderTimeout.current[ gridIndex ][ lineIndex ] )
                                                            }
                                                            if ( !highlightBorderTimeout.current[ gridIndex ] ) {
                                                                highlightBorderTimeout.current[ gridIndex ] = []
                                                            }
                                                            highlightBorderTimeout.current[ gridIndex ][ lineIndex ] = setTimeout( ()=>{
                                                                highlightBorderRef.current[ gridIndex ][ lineIndex ].style.strokeOpacity='0'
                                                                setActiveGridLine( { ...activeGridLine, gridIndex, lineIndex } )
                                                            }, 1000 ) as unknown as number
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
                                                </g> )}, 
                                            
                                        )}
                                </g>
                            ) )}
                            {activeGridLine.active&&
                            <path
                                d ={ `M${activeLineConfig.x1} ${activeLineConfig.y1} ${activeLineConfig.x2} ${activeLineConfig.y2}` }
                                stroke='grey'
                                strokeWidth={ 2 }
                                strokeOpacity={ 1 }
                            />}
                            {gridLines?.map( ( gridLine )=>(
                                <path
                                    d ={ `M${gridLine.x1} ${gridLine.y1} ${gridLine.x2} ${gridLine.y2}` }
                                    stroke='black'
                                    strokeWidth={ 2 }
                                    strokeOpacity={ 1 }
                                ></path>
                                
                            ) )}
                            
                        </svg>
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default SvgPage