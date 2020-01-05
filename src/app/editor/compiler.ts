import { ShapeClass } from './EGPShape-classes';

export function compile(objects: ShapeClass[], sketchData) {
    var codes: string[] = [];
    if(sketchData.backgroundColor && Object.values(sketchData.backgroundColor) != [0, 0, 0]) {
        // Push a box shape to the codeStack
        // Use the correct wirelink prefix and color
        codes.push(`${sketchData.wirelinkPrefix || 'EGP'}:egpBox(1, vec2(256, 256), vec2(512, 512)) ${sketchData.wirelinkPrefix || 'EGP'}:egpColor(1, vec(${sketchData.backgroundColor.r}, ${sketchData.backgroundColor.g}, ${sketchData.backgroundColor.b}))`);
    }
    objects.forEach((object) => {
        // Use the codes array length +1 to index the object
        // Using codes array length to have an index that is always
        // one in front of the current strings store in the codes array
        codes.push(object.compile(codes.length+=1));
    });

    return codes;
}