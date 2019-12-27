import { ShapeClass } from './EGPShape-classes';

export function compile(objects: ShapeClass[]) {
    var codes: string[] = [];
    
    objects.forEach((object, index) => {
        codes.push(object.compile(index));
    });

    return codes;
}