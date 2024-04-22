
import svgConsts from './svgConsts'

const {
    LineInformation,
    gridUnit,
    gridOffsetX,
    gridOffsetY,
    horizontal,
    vertical,
    frameInfo,
    frameInfoStart,
    frameIndexPointer,
    ani,
    horizontalStart,
    verticalStart,
} = svgConsts

export const calculateXByIndex = ( index ) => {
    return ( index + gridOffsetX ) * gridUnit + marginLeft
}
export const calculateXProgress = ( index, h = horizontal ) => {
    switch ( typeof index ) {
    case 'string':
        return parseInt( index, 10 )
    default:
        return h[ index ]
    }
}
export const calculateX = ( index, h = horizontal ) => {
    switch ( typeof index ) {
    case 'string':
        return ( parseInt( index, 10 ) + gridOffsetX ) * gridUnit + marginLeft
    default:
        return ( h[ index ] + gridOffsetX ) * gridUnit + marginLeft
    }
}
export const calculateY = ( index, v = vertical ) => {
    return ( v[ index ] + gridOffsetY ) * gridUnit + marginTop
}
export const calculatePositions = (
    h,
    v,
    hInfo = LineInformation.horizontal,
    vInfo = LineInformation.vertical,
) => {
    const curPositionsHorizontalWithID = []
    const curPositionsHorizontal = []
    hInfo?.forEach( ( info ) => {
        const posXStart = calculateX( info.x[ 0 ], h )
        const posYStart = calculateY( info.y, v )
        const posXEnd = calculateX( info.x[ 1 ], h )
        const posYEnd = calculateY( info.y, v )
        const curPosition = {
            start: [ posXStart, posYStart ],
            end: [ posXEnd, posYEnd ],
        }
        curPositionsHorizontal.push( curPosition )
        curPositionsHorizontalWithID.push( { id: info.id, pos: curPosition } )
    } )
    const curPositionsVerticalWithID = []
    const curPositionsVertical = []
    vInfo?.forEach( ( linesInfoEachFrame ) => {
        const curPositionsVerticalWithIDEachFrame = []
        const curPositionsVerticalEachFrame = []
        linesInfoEachFrame.forEach( ( info ) => {
            const posXStart = calculateX( info.x, h )
            const posYStart = calculateY( info.y[ 0 ], v )
            const posXEnd = calculateX( info.x, h )
            const posYEnd = calculateY( info.y[ 1 ], v )
            const curPosition = {
                start: [ posXStart, posYStart ],
                end: [ posXEnd, posYEnd ],
            }
            curPositionsVerticalEachFrame.push( curPosition )
            curPositionsVerticalWithIDEachFrame.push( {
                id: info.id,
                pos: curPosition,
            } )
        } )
        curPositionsVertical.push( curPositionsVerticalEachFrame )
        curPositionsVerticalWithID.push( curPositionsVerticalWithIDEachFrame )
    } )

    return [
        curPositionsHorizontal,
        curPositionsVertical,
        curPositionsHorizontalWithID,
        curPositionsVerticalWithID,
    ]
}
class SvgAnimation {
    constructor() {
        this.initialize()
    }

    initialize() {
        this.hPos = []
        this.vPos = []
        this.shrinkProgress = 0
        this.lastIndex = 5
        this.hPosWithID = []
        this.vPosWithID = []
        this.hData = horizontalStart
        this.vData = verticalStart
        this.updatedDataH = horizontalStart
        this.updatedDataV = verticalStart
        this.filter = { v: [ 0, this.vLineNum ], h: [ 0, this.hLineNum ] }
        this.frameNow = frameInfo
        this.swipe = false
        this.dotNumber = 0
        const currentFrameInfo = [ ...frameInfoStart ]
        this.recalculate(
            { frame: currentFrameInfo, range: null },
            horizontalStart,
            verticalStart,
        )
    }

    addDots = () => {
        this.dotNumber += 1
        const colorArray = [ 'blue', 'yellow', 'red', 'green' ]
        return findColor( colorArray[ this.dotNumber % 4 ] )
    }

    updateInfo = ( curH, curV, h, v ) => {
        this.updatedDataH = curH
        this.updatedDataV = curV
        const [
            curPositionsHorizontal,
            curPositionsVertical,
            hPosWithID,
            vPosWithID,
        ] = calculatePositions( curH, curV, h, v )

        this.hPos = curPositionsHorizontal
        this.vPos = curPositionsVertical
        this.hPosWithID = hPosWithID
        this.vPosWithID = vPosWithID
    }

    recalculate = ( { frame, range, bound }, h = this.hData, v = this.vData ) => {
        let curH = h
        let curV = v
        // if (!bound && range) {
        //     this.filter = [...range];
        // }

        frame.forEach( ( curFrame, frameIndex ) => {
            const { left: leftIndex, right: rightIndex } = range
                ? { left: range[ 0 ], right: range[ 1 ] }
                : {
                    left: horizontal[ frameIndexPointer[ frameIndex ].left ],
                    right: horizontal[ frameIndexPointer[ frameIndex ].right ],
                }
            curH = curH.map( ( info, index ) => {
                if ( index === 0 || index === curH.length - 1 ) {
                    return info
                }
                if ( bound && info < bound.left ) {
                    return Math.floor(
                        gsap.utils.mapRange(
                            frameInfo[ frameIndex ].left,
                            frameInfo[ frameIndex ].right,
                            bound.left,
                            bound.left,
                            info,
                        ),
                    )
                }

                if ( info <= rightIndex && info >= leftIndex ) {
                    return Math.floor(
                        gsap.utils.mapRange(
                            frameInfo[ frameIndex ].left,
                            frameInfo[ frameIndex ].right,
                            curFrame.left,
                            curFrame.right,
                            info,
                        ),
                    )
                }
                return info
            } )

            curV = curV.map( ( info, index ) => {
                if ( index === 0 || index === curV.length - 1 ) {
                    return info
                }
                return Math.floor(
                    gsap.utils.mapRange(
                        frameInfo[ frameIndex ].top,
                        frameInfo[ frameIndex ].bottom,
                        curFrame.top,
                        curFrame.bottom,
                        info,
                    ),
                )
            } )
        } )
        this.updateInfo( curH, curV )
    }

    swipeStart = () => {
        this.swipe = true
    }

    updateProgress( val ) {
        this.shrinkProgress = val
    }

    progressivelyMutation( startIndex, value, frameStartIndex ) {
        let curH = this.updatedDataH
        const curV = this.updatedDataV

        curH = curH.map( ( info, index ) => {
            if ( index >= startIndex && index < startIndex + value.length ) {
                return value[ index - startIndex ]
            }
            return info
        } )
        curH = curH.map( ( info, index ) => {
            if ( index < frameStartIndex && index > 0 ) {
                return curH[ frameStartIndex ]
            }
            return info
        } )

        this.updateInfo(
            curH,
            curV,
            LineInformation.horizontal,
            LineInformation.vertical,
        )
    }

    frameShrinkVertical = () => {
        let currentFrameInfo = [ ...this.frameNow ]
        currentFrameInfo = currentFrameInfo.map( ( { left, right } ) => {
            return {
                left,
                right,
                top: ani.middleY,
                bottom: ani.middleY,
            }
        } )
        this.frameNow = currentFrameInfo
        this.animationTime = 3
        this.recalculate( { frame: currentFrameInfo, range: null } )
    }

    frameExpandVertical = () => {
        let currentFrameInfo = [ ...this.frameNow ]
        currentFrameInfo = currentFrameInfo.map(
            ( { left, right }, frameInfoIndex ) => {
                return {
                    left,
                    right,
                    top: frameInfo[ frameInfoIndex ].top,
                    bottom: frameInfo[ frameInfoIndex ].bottom,
                }
            },
        )
        this.frameNow = currentFrameInfo
    }

    frameExpandHorizontal = () => {
        let currentFrameInfo = [ ...this.frameNow ]
        currentFrameInfo = currentFrameInfo.map(
            ( { top, bottom }, frameInfoIndex ) => {
                return {
                    left: frameInfo[ frameInfoIndex ].left,
                    right: frameInfo[ frameInfoIndex ].right,
                    top,
                    bottom,
                }
            },
        )
        this.frameNow = currentFrameInfo
    }

    frameShrinkHorizontal = () => {
        let currentFrameInfo = [ ...this.frameNow ]
        currentFrameInfo = currentFrameInfo.map( ( { top, bottom }, index ) => {
            return {
                left: ani.shrinkHorizontalX[ index ][ 0 ],
                right: ani.shrinkHorizontalX[ index ][ 1 ],
                top,
                bottom,
            }
        } )
        this.filter = { v: [ 0, this.vLineNum ], h: [ 0, this.hLineNum ] }
        this.frameNow = currentFrameInfo
        this.recalculate( { frame: currentFrameInfo, range: null } )
    }

    frameZoomOutHorizontalBySection = ( frameIndex, filter, destination ) => {
        this.animationTime = 0.5
        const frameInfoCopy = [ ...this.frameNow ]
        const { top, bottom } = { ...frameInfo[ frameIndex ] }
        frameInfoCopy[ frameIndex ] = destination
            ? {
                left: destination, right: destination, top, bottom,
            }
            : {
                left: ani.middleX[ frameIndex ],
                right: ani.middleX[ frameIndex ],
                top,
                bottom,
            }
        const range = filter
            ? [ horizontal[ filter[ 0 ] ], horizontal[ filter[ 1 ] ] ]
            : [ frameInfo[ frameIndex ].left, frameInfo[ frameIndex ].right ]
        this.frameNow = frameInfoCopy
        this.recalculate( { frame: frameInfoCopy, range } )
    }

    frameZoomInPhase1 = () => {
        const currentFrameInfo = [ ...frameInfo ]
        this.recalculate(
            { frame: currentFrameInfo, range: null },
            horizontalStart,
            verticalStart,
        )
    }

    frameZoomInPhase2 = () => {
        const currentFrameInfo = [ ...frameInfo ]
        this.recalculate(
            { frame: currentFrameInfo, range: null },
            horizontal,
            vertical,
        )
    }

    frameStart = () => {
        const [ info1, info2, info3 ] = [ ...frameInfo ]
        const info1copy = { ...info1 }
        const info2copy = { ...info2 }
        const info3copy = { ...info3 }
        info1copy.left = 16
        info1copy.right = 24
        info2copy.left = 46
        info2copy.right = 52
        info3copy.left = 62
        info3copy.right = 76
        this.recalculate( { frame: [ info1copy, info2copy, info3copy ] } )
    }
}
const svg = new SvgAnimation( svgConsts )

export default svg