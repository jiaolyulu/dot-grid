
const DotRects = ( { width, height, margin }:{width:number, height:number, margin:number} ) => {

    return (
        <g>
            <rect width={ width } height={ height } x={ margin } y={ margin } fill="white" />
            <rect width={ width } height={ height } x={ margin } y={ margin } className="DotRect" fill="url(#DotGrid)" />
            
        </g>
    )
} 

export default DotRects
