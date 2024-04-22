import React     from 'react'
import svgConsts from '../utils/svgConsts'

const DotGridPattern = ({margin}:{margin:number}) => {
    const {
        gridUnit, dotRadius, 
    } = svgConsts
    return (
        <pattern
            id="DotGrid"
            className="fill-slate-200"
            x={ margin }
            y={ margin }
            width={ gridUnit * 2 }
            height={ gridUnit * 2 }
            patternContentUnits="userSpaceOnUse"
            patternUnits="userSpaceOnUse"
        >
            <circle cx={ dotRadius } cy={ dotRadius } r={ dotRadius } />
            <circle
                cx={ dotRadius + gridUnit }
                cy={ dotRadius + gridUnit }
                r={ dotRadius }
            />
        </pattern>
    )
}

export default DotGridPattern
