export interface IPosition {
    x: number;
    y: number;
}

export interface IColor {
    r: number; // Red
    g: number; // Green
    b: number; // Blue
    a?: number; // Alpha (Optional)
}

export interface IStyle {
    outline?: boolean;
    angle?: number;
}

/**
 * Object interfaces are defined in the EGPShapes namespace
 */
type ObjectTypes = EGPShapes.box | EGPShapes.circle | EGPShapes.text

export interface IShape {
    /**
     *  The accepted object types defined in ObjectTypes.
     */
    objectData: ObjectTypes;

    /**
     * pos2 is relative to pos1 (Does not apply to polygon)
     */
    position: IPosition[];

    /**
     * Color defined in RGB, alpha is optinal
     */
    color: IColor;
    
    /**
     * Optinal styling for objects (such as outline and angle)
     */
    styling?: IStyle;
}

/**
 * Namespace for accepted EGP Shapes
 */
export namespace EGPShapes {
    export interface box {
        type: 'box';
        styling?: { // Optional styling for a box
            radius?: number; // Radius for rounded box
        }
    }
    export interface text {
        type: 'text';
        text: string; // Text that should be drawn to the screen
    }
    export interface circle {
        type: 'circle';
    }
}

// Add new tools here
// Remember to also add the tools in the editor component
export type Tools = 'box' | 'cursor';

// const TestShape: IShape = {
//     id: 1,
//     objectData: <EGPShapes.box>{type: 'box'},
//     position: [
//         {x: 0, y: 0},
//         {x: 10, y: 10},
//     ],
//     color: {
//         r: 255,
//         g: 170,
//         b: 50,
//     },
//     styling: {
//         outline: true,
//         angle: 45
//     }
// }