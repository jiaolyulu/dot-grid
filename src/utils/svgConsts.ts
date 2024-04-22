
const svgConsts = {
    googleColors: {
        yellow: '#FFD023',
        green: '#34A853',
        red: '#EA4335',
        blue: '#4285F4',
    },

    gridUnit: 50,
    dotRadius: 3,
    gridOffsetX: 0,
    gridOffsetY: 0,

    topLine: 338,
    bottomLine: 1838,
    midLine: 1088,
    dotSpeed: 200,
    swipeSpeed: 0.1,
    horizontal: [
        0, 0, 3, 8, 12, 15, 21, 24, 30, 34, 37, 46, 49, 52, 62, 66, 68, 70, 73,
        76, 81, 81,
    ],
    horizontalStart: [
        0, 3, 3, 3, 3, 3, 37, 37, 37, 37, 37, 46, 49, 52, 62, 66, 66, 70, 70,
        76, 76, 81,
    ],
    dot: {
        big: {
            r: 40,
            strokeWidth: 20,
        },
        small: {
            r: 18,
            strokeWidth: 9,
        },
    },

    vertical: [ 0, 3, 8, 9, 11, 12, 13, 16, 17, 19, 22 ],
    verticalStart: [ 0, 3, 3, 3, 12, 12, 12, 16, 19, 19, 22 ],
    frameIndexPointer: [
        { left: 2, right: 10 },
        { left: 11, right: 13 },
        { left: 14, right: 20 },
    ],
    frameInfo: [
        {
            left: 3, right: 34, top: 3, bottom: 19,
        },
        {
            left: 45, right: 51, top: 3, bottom: 19,
        },
        {
            left: 62, right: 76, top: 3, bottom: 19,
        },
    ],
    frameInfoStart: [
        {
            left: 0, right: 39, top: 3, bottom: 19,
        },
        {
            left: 40, right: 54, top: 3, bottom: 19,
        },
        {
            left: 56, right: 82, top: 3, bottom: 19,
        },
    ],
    shownZone: [
        [ 0, 9 ],
        [ 0, 2 ],
        [ 0, 5 ],
    ],
    mainLines: [ 'h1', 'h11' ],
    timeline: {
        maindot: 1.5,
        otherdot: 3.5,
        swipe: 5.5,
    },
    ani: {
        middleX: [ 19, 49, 69 ],

        middleY: 11,
        shrinkHorizontalX: [
            [ 16, 21 ],
            [ 49, 49 ],
            [ 69, 69 ],
        ],
        progressiveShrink: {
            delay: {
                frame1To2: 4.5,
                frame2To3: 4.5,
                frame3After: 1,
            },
        },
    },
    LineInformation: {
        horizontal: [
            {
                x: [ 0, 21 ],
                y: 1,
                id: 'h1',
                direction: 'one',
                dot: [
                    {
                        color: 'yellow',
                        x: '16',
                        xStart: '16',
                        dotRange: [ 0, 21 ],
                    },
                    {
                        color: 'red', x: '69', xStart: '69', dotRange: [ 0, 21 ],
                    },
                ],
            },
            {
                x: [ 1, 7 ],
                y: 4,
                id: 'h2',
                direction: 'both',

                dot: [
                    {
                        color: 'blue', x: 5, xStart: 1, dotRange: [ 5, 5 ],
                    },
                    {
                        color: 'red', x: 7, xStart: 6, dotRange: [ 6, 7 ],
                    },
                ],
            },
            {
                x: [ 7, 13 ],
                y: 3,
                id: 'h3',
                direction: 'both',
                dotRange: [ 7, 13 ],
                dot: [ {
                    color: 'blue', x: 11, xStart: 10, dotRange: [ 8, 11 ],
                } ],
            },
            {
                x: [ 17, 20 ],
                y: 2,
                id: 'h4',
                direction: 'both',
                dot: [ {
                    color: 'red', x: 18, xStart: 19, dotRange: [ 18, 19 ],
                } ],
            },
            {
                x: [ 1, 4 ],
                y: 6,
                id: 'h5',
            },
            { x: [ 7, 10 ], y: 6, id: 'h6' },
            {
                x: [ 12, 17 ],
                y: 5,
                id: 'h7',
                direction: 'both',
                dot: [
                    {
                        color: 'red', x: 12, xStart: '56', dotRange: [ 12, 15 ],
                    },
                ],
            },
            {
                x: [ 1, 3 ],
                y: 7,
                id: 'h8',
                direction: 'both',
                dot: [ {
                    color: 'blue', x: 2, xStart: 1, dotRange: [ 1, 2 ],
                } ],
            },
            {
                x: [ 5, 13 ],
                y: 8,
                id: 'h9',
                direction: 'both',

                dot: [
                    {
                        color: 'green', x: 13, xStart: '42', dotRange: [ 10, 13 ],
                    },
                ],
            },
            {
                x: [ 14, 16 ],
                y: 7,
                id: 'h10',
                direction: 'both',
                dot: [ {
                    color: 'blue', x: 14, xStart: 16, dotRange: [ 14, 16 ],
                } ],
            },
            {
                x: [ 0, 21 ],
                y: 9,
                id: 'h11',
                direction: 'one',

                dot: [
                    {
                        color: 'blue', x: '21', xStart: '21', dotRange: [ 0, 21 ],
                    },
                    {
                        color: 'green',
                        x: '49',
                        xStart: '49',
                        dotRange: [ 0, 21 ],
                    },
                ],
            },
        ],
        vertical: [
            [
                { x: 1, y: [ 0, 10 ], id: 'v0' },
                { x: 2, y: [ 0, 10 ], id: 'v1' },
                {
                    x: 3,
                    y: [ 1, 9 ],
                    id: 'v2',
                    direction: 'both',
                    dot: [ {
                        color: 'yellow', y: 6, yStart: 9, dotRange: [ 6, 9 ],
                    } ],
                },
                { x: 4, y: [ 4, 9 ], id: 'v3' },
                {
                    x: 5,
                    y: [ 0, 10 ],
                    id: 'v4',
                    direction: 'both',
                    dot: [ {
                        color: 'yellow', y: 8, yStart: 9, dotRange: [ 8, 9 ],
                    } ],
                },
                {
                    x: 6,
                    y: [ 1, 4 ],
                    id: 'v5',
                },
                {
                    x: 7,
                    y: [ 0, 10 ],
                    id: 'v6',
                    direction: 'both',
                    dot: [ {
                        color: 'green', y: 3, yStart: 1, dotRange: [ 1, 3 ],
                    } ],
                },
                { x: 8, y: [ 1, 3 ], id: 'v7' },
                {
                    x: 9,
                    y: [ 6, 8 ],
                    id: 'v8',
                    direction: 'both',
                    dot: [ {
                        color: 'red', y: 6, yStart: 8, dotRange: [ 6, 8 ],
                    } ],
                },
                {
                    x: 10,
                    y: [ 0, 10 ],
                    id: 'v9',
                },
            ],
            [
                { x: 11, y: [ 0, 10 ], id: 'v10' },
                {
                    x: 12,
                    y: [ 3, 8 ],
                    id: 'v11',
                },
                {
                    x: 13,
                    y: [ 0, 10 ],
                    id: 'v12',
                    direction: 'both',
                    dot: [
                        {
                            color: 'green', y: 3, yStart: 1, dotRange: [ 1, 3 ],
                        },
                    ],
                },
            ],
            [
                { x: 14, y: [ 0, 10 ], id: 'v13' },
                { x: 15, y: [ 1, 5 ], id: 'v14' },
                {
                    x: 16,
                    y: [ 5, 9 ],
                    id: 'v15',
                },
                {
                    x: 17,
                    y: [ 0, 10 ],
                    id: 'v16',
                    direction: 'both',

                    dot: [
                        {
                            color: 'green', y: 5, yStart: 1, dotRange: [ 1, 5 ],
                        },
                    ],
                },
                {
                    x: 18,
                    y: [ 1, 9 ],
                    id: 'v17',
                },
                {
                    x: 19,
                    y: [ 0, 10 ],
                    id: 'v18',
                },
                { x: 20, y: [ 0, 10 ], id: 'v19' },
            ],
        ],
    },

}
export default svgConsts